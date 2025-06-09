import { Router } from "express";
import { addProfileImage, getUserProfile, login, removeProfileImage, signup, updateUserProfile } from "../Controller/AuthController.js";
import { verifyToken } from "../Middleware/AuthMiddleware.js";
import multer from "multer";

const authRoutes=Router();

const upload=multer({dest:"uploads/profiles"});
authRoutes.post('/signup',signup);
authRoutes.post('/login',login);
authRoutes.get('/get_user',verifyToken,getUserProfile);
authRoutes.post('/update_profile',verifyToken,updateUserProfile);
authRoutes.post('/upload_image',verifyToken,upload.single("profile-image"),addProfileImage);
authRoutes.delete('/remove_profile_image',verifyToken,removeProfileImage);

export default authRoutes;