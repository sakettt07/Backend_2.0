import express from "express";
import { getProducts } from "./Api/getProducts.js";

const app=express();

app.get("/",(req,res)=>{
    res.send("Hey you are working bery hard for your project");
})
// api to get all the products..

app.get("/products",async(req,res)=>{
    const products=await getProducts();
    res.json({
        products,
    })
})

app.listen(4000,(req,res)=>{
    console.log("Your app is running on the port 4000");
})