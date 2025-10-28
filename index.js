const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const connectdb = require('./config/db');


const authRoute = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes'); 
const Order = require('./models/order'); 
const menuRoutes = require('./routes/menuRoutes');
const userRoutes = require('./routes/userRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');


dotenv.config();
connectdb();

const app = express();

// ✅ Parse incoming JSON
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5175'],
    methods: 'GET,POST,DELETE,PUT,PATCH',
    credentials: true
}));

// Root route
app.get('/', (req, res) => {
    res.status(200).send("API is working ");
});
    app.use('/api/menu', menuRoutes);
    app.use('/api/auth', authRoute)
    app.use('/api/order', require('./routes/orderRoutes'));
    app.use('/api/orders', require('./routes/orderRoutes'));

    app.use('/api/users',userRoutes);
    app.use('/api/analytics',analyticsRoutes);
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
