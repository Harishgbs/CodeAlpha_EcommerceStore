const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

router.get('/stats', auth, admin, async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const orders = await Order.find();
        const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
        const recentOrders = await Order.find()
            .populate('userId', 'firstName lastName email')
            .sort({ createdAt: -1 }).limit(5);

        res.json({ totalProducts, totalUsers, totalOrders, totalRevenue, recentOrders });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
