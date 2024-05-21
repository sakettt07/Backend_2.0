import express, { urlencoded } from "express";
const app=express();
import cors from "cors";
import cookie_parser from "cookie-parser"

app.use(cors());
// in the cors we can soecify the object in which we can write the origin which means the base url.

// setting up different parsers
app.use(express.json({limit:"18kb"}))
app.use(urlencoded({extended:true,limit:"18kb"}));
app.use(express.static("public"))
app.use(cookie_parser());

// Routesss

import userRouter from "./routes/user.routes.js";

app.use("/users",userRouter);



export{app};