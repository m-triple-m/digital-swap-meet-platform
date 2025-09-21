 const express = require('express');
const multer = require('multer');
const path = require('path');
const Model = require('../models/ProductModel');
const auth = require('../middleware/auth');

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Add item
router.post('/add', auth, upload.single('image'), async (req, res) => {
    try {
        const { name, description, category, wantedItem } = req.body;
        const image = req.file ? req.file.filename : '';
        const item = new Model({
            userId: req.user._id,
            name,
            description,
            category,
            image,
            wantedItem
        });
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all items (optionally exclude own)
router.get('/', async (req, res) => {
    try {
        const items = await Model.find().populate('userId', 'name email');
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get my items
router.get('/my', auth, async (req, res) => {
    try {
        const items = await Model.find({ userId: req.user._id });
        // console.log(items);
        
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get item by id
router.get('/:id', auth, async (req, res) => {
    try {
        const item = await Model.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await Model.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!item) return res.status(404).json({ error: 'Item not found or not authorized' });
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;