import mongoose from "mongoose";

export const Product=new mongoose.model(
    "Product",
    mongoose.Schema(
        {
            name:{
                type:String,
                required:[true,"Please enter the name"],
            },
            photo:{
                type:String,
                required:[true,"Please enter the photo"],
            },
            price:{
                type:Number,
                required:[true,"Please enter the price"],
            },
            stock:{
                type:Number,
                required:[true,"please enter the stock"]
            },
            category:{
                type:String,
                required:[true,"Please enter category"],
                trim:true,
            }
        },
        {timestamps:true}
    )
);