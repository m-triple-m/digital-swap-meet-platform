require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const UserRouter = require('./routers/UserRouter');
const ProductRouter = require('./routers/ProductRouter');
const SwapRouter = require('./routers/SwapRouter');
const AuthRouter = require('./routers/AuthRouter');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOADS_DIR || 'uploads')));

// Routers
app.use('/api/auth', AuthRouter);
app.use('/api/users', UserRouter);
app.use('/api/items', ProductRouter);
app.use('/api/swaps', SwapRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Digital Swap Meet Platform API');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});