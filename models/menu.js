const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
    trim: true,
  },
  description: { 
    type: String,
    default: '',
  },
  price: { 
    type: Number,
    required: true,
    min: 0,
  },
  image: { 
    type: String,
    default: '',
  },
  status: { 
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
  customerInfo: { 
    name: { type: String, required: true },
    number: { type: String, required: true },
    address: { type: String, required: true },
    additionalIngredient: { type: String, default: '' },
  },
  paymentMethod: { 
    type: String,
    enum: [
      'Credit Card', 
      'Debit Card', 
      'Pay on Delivery', 
      'Bank Transfer', 
      'Digital Wallet'
    ],
    required: true,
  }
}, 
{
  timestamps: true // ✅ Adds createdAt & updatedAt — very important for analytics
});

// Optional: Indexes to speed up analytics queries
orderSchema.index({ createdAt: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentMethod: 1 });
orderSchema.index({ name: 1 });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);

