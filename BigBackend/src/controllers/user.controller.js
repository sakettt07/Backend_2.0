import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  
  // get the information from the frontend.
  // validation kahi koi filed empty toh nhi h
  //check if user exist toh nhi karta.
  // check for the images and the avatar
  // upload them on cloudinary
  //create user object - In the DB
  //remove password and refresh token field from the response.
  //  check for the user creation
  // return response.


//   Validation Begins

  const { fullname, username, email, password } = req.body;
  if (fullname === "") {
    throw new ApiError(404, "FullName is required");
  }

  // the above is a beginners way of writing the validation for all the fields
  // new approach
  if (
    [fullname, username, password, email].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exist");
  }

  const avatarLocalPath=req.files?.avatar[0]?.path
  const coverImageLocalPath=req.files?.avatar[0]?.path

  if(!avatarLocalPath){
   throw new ApiError(400,"Avatar is required");
  }

  const avatar =await uploadOnCloudinary(avatarLocalPath)
  const coverImage =await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar){
   throw new ApiError(400,"Avatar is required");
  }
 const user = await User.create({
   fullname,
   avatar:avatar.url,
   coverImage:coverImage?.url || "",
   email,password,username:username.toLowerCase()
  })
 const createdUser=await User.findById(user._id).select(
   "-password -refreshToken"
 )
 if(!createdUser){
   throw new ApiError(500,"Something went wrong while registering the user")
 }
 return res.status(201).json(
   new ApiResponse(200,createdUser,"User Registered Successfully")
 )


});
const loginUser=asyncHandler(async (req,res)=>{
  // todoss
  // 
} )

export { registerUser,loginUser };
