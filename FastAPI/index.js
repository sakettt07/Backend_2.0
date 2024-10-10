// this wil be our main file where we will be importing all the modules and packages.
import express, { json } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { Product } from "./schema.js";
import NodeCache from "node-cache";

dotenv.config({
  path: ".env",
});
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "FastApi",
  })
  .then((c) => console.log("Databse Connected"))
  .catch((err) => console.log(err));

const app = express();
const nodeCache = new NodeCache();
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Apis working");
});

// making all the usefull APIs
app.get("/allproducts", async (req, res) => {
  try {
    let products;
    if (nodeCache.has("products")) {
      products = JSON.parse(nodeCache.get("products"));
    } else {
      products = await Product.find({});
      nodeCache.set("products", JSON.stringify(products));
    }
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
  }
});
app.put("/update",async(req,res)=>{
  try {
    const product=await Product.findById(req.query.id);
    product.name=req.body.name;
    await product.save();
    
    // jab update hojaye to delete kardo cache data ko taki new data ye jb fetch hoo.
    nodeCache.del("products");
    return res.json({
      success:true,
      message:"Updated",
    });
    
  } catch (error) {
    console.log(error);
  }
})
app.listen(5000, () => {
  console.log("Working");
});

// creating a function which will create fake products in the DB.

// async function generateProd(count=10) {
//     const products=[];
//     for (let i = 0; i < count; i++) {
//         const element = {
//             name:faker.commerce.productName(),
//             photo:faker.image.url(),
//             price:faker.commerce.price({min:1500,max:5000}),
//             stock:faker.commerce.price({min:0,max:50}),
//             category:faker.commerce.department(),
//             createdAt:new Date(faker.date.past()),
//             updatedAt:new Date(faker.date.recent())
//         };
//         products.push(element);

//     }
//     await Product.create(products);
//     console.log("Check DB");
// }
// generateProd(20);
