import  jwt  from "jsonwebtoken";
import User from "../Models/UserModel.js";
import { compare } from "bcrypt";
import {renameSync,unlinkSync} from  "fs";

const maxAge=3 * 24 * 60 * 60 *1000;


const createToken=(email,userId)=>{
    return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge});
};

export const signup=async (req,res,next)=>
{
    try {
        
        const {email,password}=req.body;
        if(!email || !password)
        {
            return res.status(401).json({
               message:"Please All Enter all field..."  
            })
        }

        const user=await User.create({email,password});
        const token=createToken(email,user.id);
      
        res.cookie("jwt",token,{
            maxAge,
            secure:true,
            sameSite:"None",
        })

        return res.status(201).json({
            user:{
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup 
            },
            token
        })
    
    } catch (error) {

         console.log(error);
        return res.status(401).json({
            message:"Failed To Signup User.....",
        })
        
    }
}


export const login=async (req,res,next)=>
{
    try {
        
        const {email,password}=req.body;
        if(!email || !password)
        {
            return res.status(401).json({
               message:"Please All Enter all field..."  
            })
        }

        const user=await User.findOne({email});
   
        if(!user)
        {
            return res.status(401).json({
               message:"User Not Exist with This email..."  
            })  
        }

        const auth=await compare(password,user.password);

        if(!auth)
        {
            return res.status(401).json({
               message:"Password Is Incorrect.. "  
            })   
        }

        const token=createToken(email,user.id);
        res.cookie("jwt",token,{
            maxAge,
            secure:true,
            sameSite:"None",
        })

        return res.status(201).json({
            message:"User Login Successfully..",
            user:{
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
            },
            token
        })
    
    } catch (error) {

         console.log(error);
        return res.status(401).json({
            message:"Failed To Signup User.....",
        })
        
    }
}

export const getUserProfile=async(req,res,next)=>
{
    try {
          
        const userData=await User.findById(req.userId);

        if(!userData)
        {
           return res.status(401).json({
            message:"Failed To Fetch Data....",
           });
        }

          return res.status(201).json({
            message:"User Data Get Successfully ....",
            user:{
                id:userData.id,
                email:userData.email,
                profileSetup:userData.profileSetup,
                firstName:userData.firstName,
                lastName:userData.lastName,
                image:userData.image,
            }
        })
        
    } catch (error) {
        return res.status(401).json({
            message:"Failed To Get The User Data......",
        })
    }
}


export const updateUserProfile=async(req,res,next)=>
{
    try {
          const userId=req.userId;
             
          const {firstName,lastName}=req.body;
       

          if(!firstName || !lastName)
          {
            return res.status(401).json({
                message:"FirstName LastName should be filled ..."
            });
          }

          const userData=await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                profileSetup:true
            },
            {new:true,runValidators:true}
          )
           
        if(!userData)
        {
           return res.status(401).json({
            message:"Failed To Fetch Data....",
           });
        }

          return res.status(201).json({
            message:"User Data Updated Successfully ....",
            user:{
                id:userData.id,
                email:userData.email,
                profileSetup:userData.profileSetup,
                firstName:userData.firstName,
                lastName:userData.lastName,
                image:userData.image,
            }
        })
        
    } catch (error) {

        console.log(error);
        return res.status(401).json({
            message:"Failed To Update The User Data......",
        })
    }
}


export const addProfileImage=async(req,res,next)=>
{
    try {
        
        if(!req.file)
        {
            return res.status(401).json({
                message:"File not Found...."
            });
        }
        console.log(req.file);
          
        const date=Date.now();
        const fileName="uploads/profiles" + date + req.file.originalname;
        renameSync(req.file.path,fileName);
            
         const updatedUser=await User.findOneAndUpdate(
            {_id: req.userId},
            {image:fileName},
            {new:true,runValidators:true}
         )
    

          return res.status(201).json({
            message:"User Image Uploaded Successfully ....",
            user:{
                image:updatedUser.image,
            }
        })
        
    } catch (error) {

        console.log(error);
        return res.status(401).json({
            message:"Profile Image Upload Failed....",
        })
    }
}


export const removeProfileImage =async(req,res,next)=>
{
    try {
        
        const userId=req.userId;
        const user=await User.findById(userId);

        if(!user)
        {
            return res.status(401).json({
                message:"User Not Found ...."
            });
        }

        if(user.image)
        {
            unlinkSync(user.image);
        }

        user.image=null;
        await user.save();

          return res.status(201).json({
            message:"Profile Image Remove Successfully...",
        })
        
    } catch (error) {

        console.log(error);
        return res.status(401).json({
            message:"Profile image removal failed......",
        })
    }
}


