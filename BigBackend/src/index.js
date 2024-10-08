import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`Your server is running on the port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed",err);
})















// Below is our first approach that how we can connect ot the database.
/*
import express from "express";
const app=express();


;( async ()=>{
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERROR",error);
        })
        app.listen(process.env.PORT,()=>{
            console.log(`APP is listening on ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("ERROR",error);
    }
})()
*/