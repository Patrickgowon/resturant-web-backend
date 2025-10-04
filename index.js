const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const connectdb = require('./config/db');
const usermodel = require('./models/users');
const Order = require("./models/order");

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

// REGISTER
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await usermodel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'This email already exists' });
        }

        const newuser = await usermodel.create({ name, email, password });

        return res.status(200).json({ message: 'User created successfully', user: newuser });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// LOGIN
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await usermodel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// CREATE ORDER
app.post("/api/order", async (req, res) => {
  try {
    let orders = [];

    if (Array.isArray(req.body)) {
      orders = req.body;
    } else {
      orders = [req.body];
    }

    for (const item of orders) {
      if (!item.name || !item.price) {
        return res.status(400).json({
          success: false,
          message: "Name and price are required",
        });
      }
    }

    // ✅ Save orders with customerInfo and paymentMethod
    const savedOrders = await Order.insertMany(orders);

    return res.json({
      success: true,
      message: "Orders saved successfully",
      orders: savedOrders,
    });
  } catch (error) {
    console.error("❌ Error saving order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
});


app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        const formattedOrders = orders.map(order => ({
            id: order._id,
            item: {
                name: order.name,
                description: order.description,
                price: order.price,
                image: order.image
            },
            status: order.status,
            customer: order.customerInfo || {},
            paymentMethod: order.paymentMethod || "",
            createdAt: order.createdAt
        }));

        res.json({ success: true, orders: formattedOrders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders', error });
    }
});

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
