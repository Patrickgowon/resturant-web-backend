import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    siteName:{type:String, default:'my foodie app'},
    emailNotifications:{type: Boolean,default: true},
    theme:{type: String,enum:['light','dark','auto'],default:'light'},
    role:{type:String,enum:['admin','editor','viewer'],default:'viewer'},

})