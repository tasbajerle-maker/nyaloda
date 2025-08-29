const Order = require('../models/order.model');
const Product = require('../models/product.model');
const StoreStock = require('../models/storeStock.model');
const UsageLog = require('../models/usageLog.model');
const User = require('../models/user.model');
const StockMovement = require('../models/stockMovementModel');

// A Store modellre nincs szükség, mert a bolt azonosítót String-ként kezeljük
// const Store = require('../models/store.model'); 

exports.receiveStock = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order || order.type !== 'store' || order.status !== 'approved') {
            return res.status(404).json({ message: 'Jóváhagyott bolti rendelés nem található.' });
        }
        
        if (req.user.role === 'employee' && !req.user.storeIds.includes(order.storeId)) {
            return res.status(403).json({ message: 'Nincs jogosultsága másik bolt rendelését átvenni.' });
        }

        const productNames = Object.keys(order.items);
        const centralProducts = await Product.find({ name: { $in: productNames } });
        
        for (const [itemName, quantity] of Object.entries(order.items)) {
            const product = centralProducts.find(p => p.name === itemName);
            if (!product) continue;
            
            await StoreStock.findOneAndUpdate(
                { name: itemName, storeId: order.storeId, stockType: 'backFreezer', productId: product.productId },
                { $inc: { quantity: quantity } },
                { upsert: true, new: true }
            );
        }
        
        order.status = 'completed';
        await order.save();
        res.json({ message: 'Áru sikeresen átvéve a bolti készletbe!' });
    } catch (e) { 
        res.status(500).json({ message: e.message }); 
    }
};

exports.moveToCounter = async (req, res) => {
    try {
        const { items, storeId } = req.body;
        const user = req.user; 

        if (user.role === 'employee' && !user.storeIds.includes(storeId)) {
            return res.status(403).json({ message: 'Nincs jogosultsága másik boltban mozgatni.' });
        }

        for (const [productId, moveQuantity] of Object.entries(items)) {
            if (moveQuantity <= 0) continue;

            const backFreezerItem = await StoreStock.findOne({ productId: productId, storeId: storeId, stockType: 'backFreezer' });

            if (!backFreezerItem || backFreezerItem.quantity < moveQuantity) {
                return res.status(400).json({ message: `Nincs elég készlet a(z) "${backFreezerItem.name}" termékből a raktárban!` });
            }

            backFreezerItem.quantity -= moveQuantity;
            await backFreezerItem.save();

            await StoreStock.findOneAndUpdate(
                { productId: productId, storeId: storeId, stockType: 'pult', name: backFreezerItem.name },
                { $inc: { quantity: moveQuantity } },
                { upsert: true, new: true }
            );
        }

        res.status(200).json({ message: 'Termékek sikeresen áthelyezve a pultba.' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.logUsage = async (req, res) => {
    try {
        const { items, storeId } = req.body;
        const user = req.user;

        if (user.role === 'employee' && !user.storeIds.includes(storeId)) {
            return res.status(403).json({ message: 'Nincs jogosultsága másik boltban fogyást naplózni.' });
        }

        let logs = [];
        for (const [productId, usedQuantity] of Object.entries(items)) {
            if (!usedQuantity || usedQuantity <= 0) continue;

            const stockItem = await StoreStock.findOne({ productId: productId, storeId: storeId, stockType: 'pult' });

            if (!stockItem || stockItem.quantity < usedQuantity) {
                return res.status(400).json({ message: `Nincs elég készlet a(z) "${stockItem.name}" termékből a pultban!` });
            }

            stockItem.quantity -= usedQuantity;
            await stockItem.save();
            
            logs.push({
                productId: stockItem.productId,
                productName: stockItem.name,
                quantity: usedQuantity,
                unit: 'db',
                storeId: storeId,
                userId: user.email,
            });
        }

        if (logs.length > 0) {
            await UsageLog.insertMany(logs);
        }

        res.status(201).json({ message: 'Fogyás sikeresen naplózva.' });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.logRawMaterialUsage = async (req, res) => {
    const { items, storeId } = req.body;

    if (!items || items.length === 0 || !storeId) {
        return res.status(400).json({ message: 'Hiányzó adatok: termékek listája és bolt azonosító szükséges.' });
    }

    try {
        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                throw new Error(`A ${item.productId} azonosítójú termék nem található.`);
            }
            if (product.inventoryType !== 'RAW_MATERIAL') {
                 throw new Error(`A(z) '${product.name}' nem alapanyag, nem naplózható fogyásként.`);
            }
            if (product.quantity < item.quantity) {
                throw new Error(`Nincs elegendő készlet a(z) '${product.name}' termékből a központi raktárban!`);
            }

            product.quantity -= Number(item.quantity);
            await product.save();

            await StockMovement.create({
                product: product._id,
                user: req.user._id,
                store: storeId, // Itt a frontendről kapott stringet használjuk
                type: 'USAGE',
                quantity: -Math.abs(Number(item.quantity)),
                notes: 'Napi alapanyag felhasználás'
            });
        }

        res.status(200).json({ message: 'Alapanyag fogyás sikeresen rögzítve.' });

    } catch (error) {
        console.error("Hiba a fogyás rögzítésekor:", error);
        res.status(500).json({ message: error.message || 'Szerverhiba történt a fogyás rögzítésekor.' });
    }
};

exports.useFromCounter = async (req, res) => {
    try {
        const { storeStockId } = req.body;
        const user = req.user;

        const stockItem = await StoreStock.findById(storeStockId).populate('product');
        if (!stockItem || stockItem.stockType !== 'pult') {
            return res.status(404).json({ message: 'A pultban lévő termék nem található.' });
        }
        if (!stockItem.product) {
             return res.status(404).json({ message: 'A bolti készlethez nem található központi termék.' });
        }
        
        await StockMovement.create({
             product: stockItem.product._id,
             user: user._id,
             store: stockItem.storeId, // Itt a bolti készletből jövő stringet használjuk
             type: 'SALE',
             quantity: -Math.abs(stockItem.quantity),
             notes: 'Felhasználás a pultból'
        });
        
        const usedQuantity = stockItem.quantity;
        stockItem.quantity = 0;
        await stockItem.save();
        
        await UsageLog.create({
             productId: stockItem.productId,
             productName: stockItem.name,
             quantity: usedQuantity,
             unit: 'db',
             storeId: stockItem.storeId,
             userId: user.email,
        });

        res.status(200).json({ message: `"${stockItem.name}" felhasználása sikeresen naplózva.` });

    } catch (e) {
        console.error("Hiba a pultból való felhasználáskor:", e);
        res.status(500).json({ message: e.message });
    }
};

exports.moveFromCounterToBack = async (req, res) => {
    try {
        const { storeStockId, quantity } = req.body;
        const moveQuantity = Number(quantity);

        const counterItem = await StoreStock.findById(storeStockId);
        if (!counterItem || counterItem.stockType !== 'pult' || counterItem.quantity < moveQuantity) {
            return res.status(400).json({ message: 'Nincs elegendő vagy nem létező termék a pultban.' });
        }
        
        counterItem.quantity -= moveQuantity;
        await counterItem.save();

        await StoreStock.findOneAndUpdate(
            { productId: counterItem.productId, storeId: counterItem.storeId, stockType: 'backFreezer', name: counterItem.name },
            { $inc: { quantity: moveQuantity } },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: `${moveQuantity} db "${counterItem.name}" visszaküldve a raktárba.` });

    } catch (e) {
        console.error("Hiba a raktárba való visszaküldéskor:", e);
        res.status(500).json({ message: e.message });
    }
};