const mongoose = require('mongoose');

const SwapSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  itemOfferedId: { type: mongoose.Schema.Types.ObjectId, ref: 'items', required: true },
  itemRequestedId: { type: mongoose.Schema.Types.ObjectId, ref: 'items', required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Declined'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Swap', SwapSchema);
