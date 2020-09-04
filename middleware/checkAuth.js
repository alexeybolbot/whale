const moment = require('moment');
const jwt = require('jsonwebtoken');
const Token = require('../models/token');

module.exports = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split(' ')[1];
        const decoded = await jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN);
        const token = await Token.findOne({ where: { userId: decoded.userId, accessToken }, raw: true });

        if (!token) return res.status(401).json({ message: 'Auth failed' });

        const isExpiresAt = moment().isAfter(token.expiresAt);
        if (isExpiresAt) return res.status(401).json({ message: 'Auth failed' });

        req.body.userId = token.userId;

        next();
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};
