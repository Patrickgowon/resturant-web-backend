const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const connectdb = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/food_restaurant_webapp')
        console.log('mongodb connected')
    } catch (error) {
        console.log('error coonnecting database',error)
    }
}
module.exports = connectdb