const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const connectdb = require('./config/db');
const usermodel = require('./models/users');

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

        // Simple password check (❗for now, no hashing)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
