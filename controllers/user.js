const bcrypt = require('bcrypt');
const moment = require('moment');
const emailValidator = require("email-validator");
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/token');

exports.signup = async (req, res) => {
    try {
        const { id, password } = req.body;
        if (!id || !password) return res.status(200).json({ message: 'Empty data' });

        const user = await User.findByPk(id);
        if (user) return res.status(409).json({ message: 'id exists' });

        const typeId = getTypeId(id);
        if (typeId.err) return res.status(200).json({ message: 'Incorrect id' });

        const hash = await bcrypt.hash(password, 10);
        await User.create({ id, password: hash, typeidId: typeId.val });

        const accessToken = await createToken(id);

        res.status(200).json({ accessToken });
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};

function getTypeId(id) {
    let err = 0;
    let val = null;
    const isEmail = emailValidator.validate(id);
    const phoneNumberRegexp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    const isPhoneNumber = phoneNumberRegexp.test(id);

    if (isPhoneNumber) {
        val = 1;
    } else if (isEmail) {
        val = 2;
    } else {
        err = 1;
    }

    return { err, val }
}

async function createToken(userId) {
    const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN);
    const expiresAt = moment().add(10, 'minute').toDate();

    await Token.create({
        accessToken,
        expiresAt,
        userId
    });

    return accessToken;
}

exports.signin = async (req, res) => {
    try {
        const { id, password } = req.body;
        if (!id || !password) return res.status(200).json({ message: 'Empty data' });

        const user = await User.findByPk(id);
        if (!user) return res.status(401).json({ message: 'Auth failed' });

        const isCheckPassword = await bcrypt.compare(password, user.password);
        if (!isCheckPassword) return res.status(401).json({ message: 'Auth failed' });

        const accessToken = await createToken(id);

        res.status(200).json({ accessToken });
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};

exports.info = async (req, res) => {
    try {
        const user = await User.findByPk(req.body.userId);
        if (!user) return res.status(200).json({ message: 'id is missing' });

        const typeId = await user.getTypeid();

        res.status(200).json({ id: req.body.userId, typeId: typeId.nm });
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const all = req.params.all;
        if (!all) return res.status(400).json({ message: 'Missing parameter all' });

        if (all === "true") {
            await deleteAllTokens(req.body.userId);
        } else if (all === "false") {
            const accessToken = req.headers.authorization.split(' ')[1];
            await deleteToken(accessToken, req.body.userId);
        } else {
            return res.status(400).json({ message: 'Incorrect parameter all' });
        }

        return res.status(200).json({ message: 'Logout' });
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};

async function deleteAllTokens(userId) {
    await Token.destroy({ where: { userId } });
}

async function deleteToken(accessToken, userId) {
    await Token.destroy({ where: { accessToken, userId } });
}
