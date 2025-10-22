const user = require('../models/users')

// fetch all user 

const getAllUsers = async(req,res) =>{
    try {
       const users = await user.find().select('-password');
       res.json({success:true,users}) 
    } catch (error) {
        console.error('error fecthing users',error);
        res.status(500).json({success: false, message:'failed to fetch users'})
    }
}

module.exports = {getAllUsers};