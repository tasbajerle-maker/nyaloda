const Order = require('../models/order.model');
const Product = require('../models/product.model');
const StoreStock = require('../models/storeStock.model');
const UsageLog = require('../models/usageLog.model');
const User = require('../models/user.model');

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
                { upsert: true, new: true } // Creates the doc if it doesn't exist
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
        const user = await User.findById(req.user.userId);

        if (req.user.role === 'employee' && !user.storeIds.includes(storeId)) {
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
        const user = await User.findById(req.user.userId);

        if (req.user.role === 'employee' && !user.storeIds.includes(storeId)) {
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
                unit: 'db', // Ezt később lehetne a termékből venni
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