import express from "express";

const app=express();

app.get("/",(req,res)=>{
    res.send("Hey you are working bery hard for your project");
})

app.listen(4000,(req,res)=>{
    console.log("Your app is running on the port 4000");
})