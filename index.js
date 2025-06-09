import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser";
import mongoose from 'mongoose'
import connectDB from "./Utils/Database.js";

dotenv.config();
const app=express();
app.use(cookieParser());
app.use(express.json());


app.use(cors({
    origin:["*"],
    methods:["GET","POST","DELETE","PUT","PATCH"],
    credentials:true,
}))

const PORT=process.env.PORT || 8000;

app.get("/",(req,res)=>{
    res.send("First API is Running....")
})


app.listen(PORT,()=>{
    console.log("Server is Running on Port ",PORT)
})