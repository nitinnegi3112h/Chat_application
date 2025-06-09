import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser";
import mongoose from 'mongoose'
import connectDB from "./Utils/Database.js";
import authRoutes from "./Routes/authRoutes.js";

dotenv.config();
const app=express();
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRoutes);

app.use(cors({
    origin:["*"],
    methods:["GET","POST","DELETE","PUT","PATCH"],
    credentials:true,
}))

const PORT=process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send("First API is Running....")
})



app.listen(PORT,()=>{
    connectDB();
    console.log("Server is Running on Port ",PORT)
})