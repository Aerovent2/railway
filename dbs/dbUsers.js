import * as dotenv from 'dotenv'
import mongoose from "mongoose";

dotenv.config()
export function DBConnect(cb){
    mongoose.connect(process.env.DB_USERS),
    {useNewUrlParser:true},(err)=>{if(err)cb(err)}
}

export const Users = mongoose.model('users',{
    username:String,
    password:String,
    email:String

})