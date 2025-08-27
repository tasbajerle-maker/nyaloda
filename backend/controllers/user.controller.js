const User = require('../models/user.model');

// Helper function to convert Mongoose docs to plain objects with an 'id' field
const toJSONWithId = (doc) => {
    const jsonObj = doc.toJSON({ virtuals: true });
    jsonObj.id = jsonObj._id.toString();
    delete jsonObj._id;
    delete jsonObj.__v;
    return jsonObj;
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users.map(toJSONWithId));
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { email, password, role, storeIds } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Email, jelszó és szerepkör megadása kötelező.' });
        }
        if (role === 'employee' && (!storeIds || storeIds.length === 0)) {
            return res.status(400).json({ message: 'Alkalmazotti regisztrációnál a boltok listájának (storeIds) megadása kötelező.' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Ez az email cím már foglalt.' });
        }
        const user = new User({ email, password, role, storeIds });
        const savedUser = await user.save();
        res.status(201).json(toJSONWithId(savedUser));
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'A felhasználó nem található.' });
        }
        const updates = req.body;
        if (updates.email) user.email = updates.email;
        if (updates.role) user.role = updates.role;
        if (updates.storeIds) user.storeIds = updates.storeIds;
        if (updates.password && updates.password.length > 5) {
            user.password = updates.password;
        }

        const updatedUser = await user.save();
        res.json(toJSONWithId(updatedUser));
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'A felhasználó nem található.' });
        }
        if (user.role === 'manager') {
            return res.status(400).json({ message: 'Manager fiókot nem lehet törölni.' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: `"${user.email}" felhasználó sikeresen törölve.` });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};