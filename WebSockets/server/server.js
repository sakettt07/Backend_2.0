import express from "express";
import {Server} from "socket.io";
import {createServer} from "http"

const port =3000;
const app=express();
const server=createServer(app);

const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true,
    }
});

app.get("/",(req,res)=>{
    res.send("hello world");
})

io.on("connection",(socket)=>{
    console.log("User connected",socket.id);
    // console.log("Id",socket.id);
    // socket.emit('welcome','welcome to the server')    //this is to send the msg to all the conections
    // socket.broadcast.emit("welcome",`${socket.id} joiined the server`)      //this will send the msg to particular curcuit.
    socket.on("disconnect",()=>{
        console.log("User Disconnected",socket.id)
    })

    socket.on("message",({room,message})=>{
        console.log({room,message});
        io.to(room).emit("receive-msg",message);
    })
    socket.on("join-room",(room)=>{
        socket.join(room);
    })
    
})

server.listen(port,()=>{
    console.log(`Your server is running on the ${port}`);
})