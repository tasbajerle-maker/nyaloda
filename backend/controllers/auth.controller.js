const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
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
        await user.save();
        res.status(201).json({ message: 'Sikeres regisztráció!' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email és jelszó megadása kötelező.' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Hibás email vagy jelszó.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Hibás email vagy jelszó.' });
        }
        const token = jwt.sign(
            { userId: user._id, role: user.role, storeIds: user.storeIds },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({ token, user: { email: user.email, role: user.role, storeIds: user.storeIds } });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};