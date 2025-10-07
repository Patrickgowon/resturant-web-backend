const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const connectdb = require('./config/db');


const authRoute = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes'); 
const Order = require('./models/order'); 


dotenv.config();
connectdb();

const app = express();

// ✅ Parse incoming JSON
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173'],
    methods: 'GET,POST,DELETE,PUT,PATCH',
    credentials: true
}));

// Root route
app.get('/', (req, res) => {
    res.status(200).send("API is working ");
});

  app.use('/api/auth', authRoute)


app.use("/api/orders",orderRoutes
  
);




// Update order status
app.put("/api/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
});


app.delete("/api/orders/:id", async (req, res) => {
  try {
    const orderid = req.params.id
    const deleteorder = await Order.findByIdAndDelete(orderid)
    res.status(200).json({message:'order deleted successfully',deleteorder});
  } catch (error) {
    console.log('server error',error)
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
