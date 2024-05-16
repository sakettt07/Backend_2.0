import mongoose, { Schema } from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    avatar:{
        type:String, //cloudinary
        required:true,
    },
    coverImage:{
        type:String, //cloudinary
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,'Password is required']
    },
    refreshToken:{
        type:String,
    }
  },

  {
    timestamps:true
  }
);
export const User = new mongoose.model("User", userSchema);
