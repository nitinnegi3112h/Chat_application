import { Server as SocketIOServer } from "socket.io";


const setupSocket=(server)=>{

     const io=new SocketIOServer(server,{
        cors:{
            origin:["*"],
            methods:["POST","GET"],
            credentials:true
        }
})

}

export default setupSocket;