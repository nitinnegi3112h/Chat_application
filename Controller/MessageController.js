import Message from "../Models/MessagesModel.js";
import {mkdirSync} from "fs"

export const getMessages=async(req,res,next)=>
{
    try {
        const user1=req.userId;
        const user2=req.body.user2;

        console.log(user1,user2);

        if(!user1 || !user2)
        {
            return res.status(401).json({
                message:"Both User Id should be exist...."
            });
        }

        const messages=await Message.find({
            $or:[{senders:user1,receiver:user2},
                {senders:user2,receiver:user1}]
        }).sort({timestamp:1});

      
        return res.status(201).json({
           messages
        })
        
    } catch (error) {
         console.log(error);
        return res.status(401).json({
            message:"Failed To fetch messages ",
        })
    }
}


export const uploadFile=async(req,res,next)=>
{
    try {
        
        if(!req.file)
        {
            return res.status(401).json({
                message:"File not Found...."
            });
        }
        
        const date=Date.now();
        let fileDir=`uploads/file/${date}`;
        const fileName=`${fileDir}/${req.file.originalname}`;

        mkdirSync(fileDir,{recursiv:true});
        renameSync(req.file.path,fileName);
            
        //  const updatedUser=await User.findOneAndUpdate(
        //     {_id: req.userId},
        //     {image:fileName},
        //     {new:true,runValidators:true}
        //  )
    

          return res.status(201).json({
            message:"User File Uploaded Successfully ....",
            user:{
                filePath:fileName,
            }
        })
        
    } catch (error) {

        console.log(error);
        return res.status(401).json({
            message:"File  Upload Failed....",
        })
    }
}
