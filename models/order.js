const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: { // Item name
        type: String,
        required: true,
        trim: true,
    },
    description: { // Item description
        type: String,
        default: '',
    },
    price: { // Item price
        type: Number,
        required: true,
    },
    image: { // Item image URL
        type: String,
        default: '',
    },
    status: { // Order status
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
    },
    customerInfo: { // Customer details
        name: { type: String, required: true },
        number: { type: String, required: true },
        address: { type: String, required: true },
        additionalIngredient: { type: String, default: '' },
    },
    paymentMethod: { 
        
        type: String,
        enum: ['Credit Card', 'Debit Card', 'Pay on Delivery', 'Bank Transfer', 'Digital Wallet'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
