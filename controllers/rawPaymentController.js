const rawPaymentService = require('../services/rawPaymentService');

const getAllRawPayment = async (req, res) => {
    try {
        const rawPayments = await rawPaymentService.getAllRawPayment();
        return res.status(200).json({ success: true, rawPayments });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}
const successPayment = async (req, res) => {
    try {
        const id = req.query.id;
        await rawPaymentService.updateRawPaymentStatus(id, 'SUCCESS');
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const cancelPayment = async (req, res) => {
    try {
        const id = req.query.id;
        // console.log(req.query.id);
        // console.log(id);
        await rawPaymentService.updateRawPaymentStatus(id, 'CANCEL');

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

module.exports = {
    successPayment,
    cancelPayment,
    getAllRawPayment

}