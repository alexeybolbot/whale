const moment = require('moment');
const Token = require('../models/token');

module.exports = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split(" ")[1];
        const expiresAt = moment().add(10, 'minute').toDate();

        await Token.update({ expiresAt }, { where: { userId: req.body.userId, accessToken } });

        next();
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};

