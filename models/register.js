import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:'/img/pngegg.png'
    },
    date:{
        type:Date,
        default:Date.now
    }

}, {versionKey: false});

export default mongoose.model('Register', userSchema);