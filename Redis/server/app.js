import express from "express";
import { getProductDetail, getProducts } from "./Api/getProducts.js";
import Redis from "ioredis";

const app=express();
const redis=new Redis({
    password: 'EMPhc1NUQyQJBegRhEZqEGvlEcMsygVe',
    host: 'redis-10565.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 10565
})
redis.on("connect",()=>{
    console.log("Redis is connected")
})




app.get("/",(req,res)=>{
    res.send("Hey you are working bery hard for your project");
})
// api to get all the products..

app.get("/products",async(req,res)=>{

    // if products are present in the redis DB then it will be fetched 
    let products=await redis.get("products");

    if(products){

        return res.json({
            products:JSON.parse(products),
            message:"Products fetched"
        })
    }
    // if it does not exist then it will be saved then fetched
    products=await getProducts();
    await redis.set("products",JSON.stringify(products.products));


    // we cab us the setx method to set the data for a specific timeperiod.
    await redis.setex("products",20,JSON.stringify(products.products));
    res.json({
        products,
    })
})


// API to get details of an individual product
app.get("/product/:id", async (req, res) => {
    const productId = req.params.id;

    // Check if the product details are in Redis cache
    let product = await redis.get(`product:${productId}`);

    if (product) {
        // If found in cache, return the product details
        return res.json({
            product: JSON.parse(product),
            message: "Product fetched from cache"
        });
    }

    // If not in cache, fetch from the main data source
    try {
        product = await getProductDetail(productId);

        // Cache the product details in Redis for 1 hour (3600 seconds)
        await redis.setex(`product:${productId}`, 3600, JSON.stringify(product));

        res.json({
            product,
            message: "Product fetched from main data source and cached"
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        if (error.message === 'Product not found') {
            res.status(404).json({ message: "Product not found" });
        } else {
            res.status(500).json({ message: "Error fetching product details" });
        }
    }
});



app.listen(4000,(req,res)=>{
    console.log("Your app is running on the port 4000");
})