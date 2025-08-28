const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Szükségünk van a User modellre

exports.authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // Nincs token

    try {
        // 1. Beolvassuk a "személyit" (token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // A decoded most valami ilyesmi: { userId: '...', role: '...' }

        // 2. A személyiben lévő ID alapján megkeressük a felhasználót az adatbázisban
        // A .select('-password') biztosítja, hogy a jelszót ne adjuk tovább
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.sendStatus(403); // A tokenben lévő felhasználó már nem létezik
        }

        // 3. A teljes, adatbázisból jövő felhasználói objektumot tesszük a kérésre
        req.user = user;
        next();

    } catch (err) {
        return res.sendStatus(403); // Érvénytelen token
    }
};

exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Ez a rész már tökéletesen fog működni, mert a req.user egy teljes objektum
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Nincs jogosultsága ehhez a művelethez.' });
        }
        next();
    };
};