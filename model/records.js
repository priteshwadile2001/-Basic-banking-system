const mongoose = require('mongoose');

const transferRecords = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    semail: {
        type: String,
        required: true
    },
    reciver: {
        type: String,
        required: true
    },
    remail: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

})

const paymentHistory = mongoose.model('paymentDetail', transferRecords);

module.exports = paymentHistory;