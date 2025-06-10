import { Router } from "express";
import { verifyToken } from "../Middleware/AuthMiddleware.js";
import { getMessages, uploadFile } from "../Controller/MessageController.js";
import multer from "multer";

const messageRouter=Router();
const upload=multer({dest:"uploads/file"});

messageRouter.post('/get_messages',verifyToken,getMessages);
messageRouter.post('/upload_file',verifyToken,upload.single("file"),uploadFile);


export default messageRouter;