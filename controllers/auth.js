const usermodel = require('../models/users');



// REGISTER
const register = async(req, res) =>{
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
}

// LOGIN
const login = async(req,res) =>{
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
}




module.exports = {register,login}