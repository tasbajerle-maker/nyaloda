const Product = require('../models/product.model');
const StoreStock = require('../models/storeStock.model');
const StockMovement = require('../models/stockMovementModel');

// Helper function to convert Mongoose docs to plain objects with an 'id' field
const toJSONWithId = (doc) => {
    const jsonObj = doc.toJSON({ virtuals: true });
    jsonObj.id = jsonObj._id.toString();
    delete jsonObj._id;
    delete jsonObj.__v;
    return jsonObj;
};

exports.createProduct = async (req, res) => {
    if (req.body.barcode === '') req.body.barcode = null;
    const productData = { ...req.body, productId: `prod_${Date.now()}` };
    const p = new Product(productData);
    try {
        await p.save();
        res.status(201).json(toJSONWithId(p));
    } catch (e) {
        if (e.code === 11000) {
            return res.status(400).json({ message: `Ez a vonalkód (${req.body.barcode}) már foglalt!` });
        }
        res.status(400).json(e);
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'A termék nem található.' });
        }
        
        const updates = req.body;
        const fields = ['name', 'barcode', 'quantity', 'unit', 'type', 'isPartnerVisible', 'partnerPrice', 'datasheet'];
        
        fields.forEach(field => {
            if (updates[field] !== undefined) {
                product[field] = updates[field];
            }
        });

        if (updates.barcode === '') product.barcode = null;

        const updatedProduct = await product.save();
        res.json(toJSONWithId(updatedProduct));
    } catch (e) {
        if (e.code === 11000) {
            return res.status(400).json({ message: `Ez a vonalkód (${req.body.barcode}) már egy másik termékhez tartozik!` });
        }
        res.status(500).json({ message: e.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productToDelete = await Product.findById(req.params.id);
        if (!productToDelete) {
            return res.status(404).json({ message: 'A termék nem található.' });
        }
        
        await Product.findByIdAndDelete(req.params.id);
        await StoreStock.deleteMany({ productId: productToDelete.productId });
        
        res.json({ message: `"${productToDelete.name}" sikeresen törölve.` });
    } catch (e) { 
        res.status(500).json({ message: e.message }); 
    }
};

exports.receiveProductByBarcode = async (req, res) => {
    const { barcode, quantity } = req.body;

    if (!barcode || !quantity || Number(quantity) <= 0) {
        return res.status(400).json({ message: 'Hiányzó vagy érvénytelen adatok.' });
    }

    try {
        const product = await Product.findOne({ barcode: barcode });

        if (!product) {
            return res.status(404).json({ message: `A '${barcode}' vonalkód nem található a késztermékek között.` });
        }

        product.quantity += Number(quantity);

        await StockMovement.create({
            product: product._id,
            type: 'RECEIVE',
            quantity: Number(quantity),
            user: '68acccb4eb1c177f49691f57',
            notes: 'Vonalkódos bevételezés'
        });

        const updatedProduct = await product.save();

        res.status(200).json({
            message: `Siker! '${updatedProduct.name}' készlete megnövelve. Új készlet: ${updatedProduct.quantity}`,
            product: toJSONWithId(updatedProduct)
        });

    } catch (error) {
        console.error('Hiba a termék bevételezésekor:', error);
        res.status(500).json({ message: 'Szerverhiba történt a bevételezés során.' });
    }
};

exports.wasteProduct = async (req, res) => {
    const { productId, quantity, notes } = req.body;

    if (!productId || !quantity || Number(quantity) <= 0) {
        return res.status(400).json({ message: 'Hiányzó adatok: termék ID és pozitív mennyiség szükséges.' });
    }

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'A termék nem található.' });
        }

        if (product.quantity < quantity) {
            return res.status(400).json({ message: `Nincs elegendő készlet a selejtezéshez! Jelenlegi készlet: ${product.quantity}` });
        }

        product.quantity -= Number(quantity);
        
        await StockMovement.create({
            product: product._id,
            type: 'WASTE',
            quantity: -Math.abs(Number(quantity)),
            user: req.user._id,
            notes: notes || 'Selejtezés'
        });

        const updatedProduct = await product.save();

        res.status(200).json({
            message: `Siker! '${updatedProduct.name}' készlete csökkentve. Új készlet: ${updatedProduct.quantity}`,
            product: toJSONWithId(updatedProduct)
        });

    } catch (error) {
        console.error('Hiba a termék selejtezésekor:', error);
        res.status(500).json({ message: 'Szerverhiba történt a selejtezés során.' });
    }
};