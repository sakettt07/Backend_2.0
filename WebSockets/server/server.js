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
    console.log("User connected");
    console.log("Id",socket.id);
})

server.listen(port,()=>{
    console.log(`Your server is running on the ${port}`);
})