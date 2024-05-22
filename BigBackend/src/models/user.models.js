import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import from "j"
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
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10)
    next();
    
})
// making custom passwchecker method.
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
// making new token generation methods
userSchema.methods.generateAccess=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.usermame,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }

    )
    
}
userSchema.methods.generateRefresh=function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }

    )

}

export const User = new mongoose.model("User", userSchema);
