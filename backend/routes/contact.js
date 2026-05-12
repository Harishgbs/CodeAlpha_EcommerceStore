const express = require('express');
const router = express.Router();

const contacts = [];

router.post('/', (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const contact = { id: Date.now(), name, email, subject, message, date: new Date().toLocaleString() };
        contacts.push(contact);
        res.status(201).json({ msg: 'Message received' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/', (req, res) => {
    res.json(contacts);
});

module.exports = router;
