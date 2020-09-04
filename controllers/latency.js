const ping = require('ping');

exports.latency = async (req, res) => {
    try {
        const host = 'google.com';
        const pingInfo = await ping.promise.probe(host);

        res.status(200).json({ latency: pingInfo.time });
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};
