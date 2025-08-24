const { Schema, model } = require('../connection');

const mySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    wantedItem: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('items', mySchema);