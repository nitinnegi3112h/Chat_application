
import { Server as SocketIOServer } from "socket.io";
import Message from "./Models/MessagesModel.js";
import Group from "./Models/GroupModel.js";


const setupSocket=(server)=>{

     const io=new SocketIOServer(server,{
        cors:{
            origin:["*"],
            methods:["POST","GET"],
            credentials:true
        }
   });
   
   const userSocketMap=new Map();

   const disconnect=(socket)=>{
    console.log(`Client Disconnected ${socket.id}`);
    for(const [userId,socketId] of userSocketMap.entries())
    {
        if(socketId == socket.id)
        {
            userSocketMap.delete(userId);
            break;
        }
    }
   };

   const sendMessage=async(message)=>
   {
      const senderSockerId=userSocketMap.get(message.senders);
      const receiverSockerId=userSocketMap.get(message.receiver);
     
      const createMessage=await Message.create(message);

      const messageData=await Message.findById(createMessage._id)
      .populate("senders","id email firstName lastName image")
      .populate("receiver","id email firstName lastName image");
   
      console.log("message Sending mode on",messageData);
       console.log("receiverSockerId:",receiverSockerId);
       console.log("senderSockerId:",senderSockerId);
      
      if(receiverSockerId)
      {
        io.to(receiverSockerId).emit("receiverMessage",messageData);
      }

      if(senderSockerId)
      {
        io.to(senderSockerId).emit("receiverMessage",messageData);
      }


    }


    const groupMessage=async(message)=>
    {
        const {group_id,content,senders,messageType} =message;
         console.log(message);

        const createMessage=await Message.create({
            senders,
            content,
            messageType,
            receiver:null,
            timestamp:new Date(),
        });

       const messageData=await Message.findById(createMessage._id)
       .populate('senders',"id email firstName lastName")
       .exec();

       await Group.findByIdAndUpdate(group_id,{
        $push:{messages: createMessage._id},
       });
       

       const group=await Group.findById(group_id).populate("members");
       const finalData={...messageData._doc,groupId:group._id};

       if(group && group.members)
       {
           group.members.forEach((memeber)=>{
            const memeberSocketId=userSocketMap.get(memeber._id.toString());

            if(memeberSocketId)
            {
                io.to(memeberSocketId).emit("receive_group_message",finalData);
            }
          
            const adminSocketId=userSocketMap.get(group.admin._id.toString());

          
            if(adminSocketId)
            {
                io.to(adminSocketId).emit("receive_group_message",finalData);
            }

        })
       }

    }

   io.on('connection',(socket)=>{
     const userId=socket.handshake.query.userID;

     if(userId)
     {
      userSocketMap.set(userId,socket.id);
      console.log(`User Connected: ${userId} with Socket Id: ${socket.id}`);
     }
     else
     {
      console.log('User ID not provided during connection..')
     }

     socket.on('group_message',groupMessage);
     socket.on('sendMessage',sendMessage);
     socket.on('disconnect',()=>disconnect(socket));
   })

}

export default setupSocket;