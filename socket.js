
import { Server as SocketIOServer } from "socket.io";


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
      
   }

   io.on('connection',(socket)=>{
     const userId=socket.handshake.query.userID;

     console.log(socket.handshake.query.userID)

     if(userId)
     {
      userSocketMap.set(userId,socket.id);
      console.log(`User Connected: ${userId} with Socket Id: ${socket.id}`);
     }
     else
     {
      console.log('User ID not provided during connection..')
     }


     socket.on('sendMessage',sendMessage);
     socket.on('disconnect',()=>disconnect(socket));
   })

}

export default setupSocket;