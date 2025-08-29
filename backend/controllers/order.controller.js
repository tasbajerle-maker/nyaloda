const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');

const toJSONWithId = (doc) => {
    if (!doc) return null;
    const jsonObj = doc.toJSON({ virtuals: true });
    jsonObj.id = jsonObj._id.toString();
    delete jsonObj._id;
    delete jsonObj.__v;
    return jsonObj;
};

exports.createOrder = async (req, res) => {
    try {
        const { orderItems, orderType, storeId } = req.body;
        
        if (!orderItems || Object.keys(orderItems).length === 0) {
            return res.status(400).json({ message: "A rendelés nem tartalmazhat tételeket." });
        }

        // JAVÍTÁS: A felhasználót közvetlenül a req.user-ből vesszük, nem keresünk rá újra.
        const userFromToken = req.user;
        if (!userFromToken) {
            // Ez a hiba elvileg sosem fordulhat elő, ha a middleware lefutott.
            return res.status(404).json({ message: "A felhasználó nem található." });
        }

        const productIds = Object.keys(orderItems);
        let validProductObjectIds = [];

        for (const id of productIds) {
            if (mongoose.Types.ObjectId.isValid(id)) {
                validProductObjectIds.push(new mongoose.Types.ObjectId(id));
            } else {
                console.warn(`Figyelmeztetés: Hibás termék ID a rendelésben, kihagyva: ${id}`);
            }
        }
        
        if (validProductObjectIds.length === 0) {
            return res.status(400).json({ message: "A rendelés nem tartalmazott érvényes tételeket." });
        }

        const centralStock = await Product.find({ '_id': { $in: validProductObjectIds } });
        
        let itemsForOrder = {};
        for (const p of centralStock) {
            const pId = p._id.toString();
            if (orderItems[pId]) {
                itemsForOrder[p.name] = orderItems[pId];
            }
        }

        const orderOwner = orderType === 'store' ? storeId : userFromToken.email.split('@')[0];
        const newOrder = new Order({
            orderId: `rend_${Date.now()}`,
            owner: orderOwner,
            storeId: orderType === 'store' ? storeId : null,
            date: new Date().toLocaleDateString(),
            status: 'pending',
            items: itemsForOrder,
            type: orderType
        });

        await newOrder.save();
        res.status(201).json(toJSONWithId(newOrder));

    } catch (e) {
        console.error("KRITIKUS HIBA a rendelés létrehozásakor:", e);
        res.status(500).json({ message: "Szerverhiba történt a rendelés feldolgozása közben." });
    }
};

exports.approveOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'A rendelés nem található.' });

        const productNames = Object.keys(order.items);
        const centralProducts = await Product.find({ name: { $in: productNames } });

        for (const [itemName, quantity] of Object.entries(order.items)) {
            const product = centralProducts.find(p => p.name === itemName);
            if (!product || product.quantity < quantity) {
                return res.status(400).json({ message: `Nincs elég készlet a(z) "${itemName}" termékből!` });
            }
        }

        for (const [itemName, quantity] of Object.entries(order.items)) {
            await Product.updateOne({ name: itemName }, { $inc: { quantity: -quantity } });
        }

        order.status = 'approved';
        await order.save();
        res.json(toJSONWithId(order));
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.rejectOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'A rendelés nem található.' });
        
        order.status = 'rejected';
        await order.save();
        res.json(toJSONWithId(order));
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};