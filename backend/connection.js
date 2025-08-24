const mongoose = require('mongoose');

const url = process.env.MONGODB_URI || "mongodb://localhost:27017/digital_swap_meet";

mongoose.connect(url)
    .then(() => {
        console.log('database connected');
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = mongoose;