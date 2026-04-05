const rawPaymentService = require('../services/rawPaymentService');

const handleSuccess = async (req, res) => {
    try {
        const paymentLinkId = req.query.paymentLinkId;

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}