const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const { items, shippingAddress, total } = req.body;
        const order = new Order({
            userId: req.user.id,
            items,
            shippingAddress,
            total
        });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/my', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/all', auth, async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'firstName lastName email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

router.put('/:id/status', auth, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
