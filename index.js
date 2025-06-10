import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import http from "http";
import cookieParser from "cookie-parser";
import mongoose from 'mongoose'
import connectDB from "./Utils/Database.js";
import authRoutes from "./Routes/authRoutes.js";
import setupSocket from "./socket.js";
import messageRouter from "./Routes/MessagesRoutes.js";
import groupRouter from "./Routes/GroupRoutes.js";

const app = express();
const server = http.createServer(app);

dotenv.config();

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRouter);
app.use("/api/group",groupRouter);

app.use(cors({
    origin:["*"],
    methods:["GET","POST","DELETE","PUT","PATCH"],
    credentials:true,
}))


setupSocket(server);

app.use("/uploads/profiles",express.static("uploads/profiles"));
app.use("/uploads/file",express.static("uploads/file"));

const PORT=process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send("First API is Running....")
})



server.listen(PORT,()=>{
    connectDB();
    console.log("Server is Running on Port ",PORT)
})