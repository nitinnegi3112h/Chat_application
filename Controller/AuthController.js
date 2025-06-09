import  jwt  from "jsonwebtoken";
import User from "../Models/UserModel.js";
import { compare } from "bcrypt";


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
        res.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None",
        })

        return res.status(201).json({
            user:{
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup 
            }
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


        res.cookie("jwt",createToken(email,user.id),{
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
            }
        })
    
    } catch (error) {

         console.log(error);
        return res.status(401).json({
            message:"Failed To Signup User.....",
        })
        
    }
}