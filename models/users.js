const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: { type:String,require: true},
    email: {type:String, unique:true},
    password:{type:String, require:true},
    role:{type:String,enum:['admin','user','viewer'],default:'user'},

})


module.exports = mongoose.model('user',userSchema)