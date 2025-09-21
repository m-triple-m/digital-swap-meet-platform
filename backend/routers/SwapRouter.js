const express = require('express');
const router = express.Router();
const Swap = require('../models/SwapModel');
const Item = require('../models/ProductModel');
const User = require('../models/UserModel');
const auth = require('../middleware/auth');

// Create swap request
router.post('/', auth, async (req, res) => {
  try {
    const { toUserId, itemOfferedId, itemRequestedId } = req.body;
    const swap = new Swap({
      fromUserId: req.user.id,
      toUserId,
      itemOfferedId,
      itemRequestedId,
      status: 'Pending'
    });
    await swap.save();
    res.status(201).json(swap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get sent and received swaps
router.get('/my-swaps', auth, async (req, res) => {
  // console.log(req.user);
  
  try {
    const sent = await Swap.find({ fromUserId: req.user._id })
      .populate('itemOfferedId itemRequestedId toUserId');
    const received = await Swap.find({ toUserId: req.user._id })
      .populate('itemOfferedId itemRequestedId fromUserId');
      console.log(sent, received);
      
    res.json({ sent, received });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/swaps',  async (req, res) => {
  try {
    const sent = await Swap.find()
    res.json(sent);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Accept or decline swap
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Accepted', 'Declined'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const swap = await Swap.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(swap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
