const Product = require('../models/product.model');
const StoreStock = require('../models/storeStock.model');

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