import { populate } from "dotenv";
import Group from "../Models/GroupModel.js";
import User from "../Models/UserModel.js";


export const createGroup=async (req,res,next)=>
{
    try {
        
        const {name,members}=req.body;
        const userId=req.userId;

        const admin=await User.findById(userId);

        if(!admin)
        {
           return res.status(401).json({
            message:"Admin User Not Found Valid"
           });
        }

        const validMembers=await User.find({_id:{$in:members}});

        if(validMembers.length !== members.length)
        {
            return res.status(401).json({
                message:"You Have Added Invalid Members in Groups..."
            });
        }

        const newGroup=new Group({
            name,
            members,
            admin:userId,
        });

        await newGroup.save();


        return res.status(201).json({
            Group:newGroup
        })


    } catch (error) {
      
        return res.status(401).json({
            message:"Error occur while creating New Group"
        })
    }
}


export const getGroupMessage=async (req,res,next)=>
{
    try {
        
        const {groupId}=req.params;

        const group=await group.findById(groupId).populate({
            paths:"messages",
            populate:{
                path:"sender",
                select:"firstName lastName email _id"
            },
        })


        if(!group)
        { 
          return res.status(401).json({
            message:"Group Not exist...."
          });
        }

        const messages=group.messages;

        return res.status(201).json({
            messages
        })

    } catch (error) {
        
        return res.status(401).json({
            message:"Not Able to found Group Messagess...."
        })
    }
}