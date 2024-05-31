import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// method to generate
const generateAccessAndRefreshToken=async(userid)=>{
  try {
    const user=await User.findById(userid);
    const accessToken=user.generateAccess();
    const refreshToken=user.generateRefresh();
    user.refreshToken=refreshToken
    await user.save({validateBeforeSave:false})
    return {accessToken,refreshToken};
  } catch (error) {
    throw new ApiError(500,"Something went wrong while generating tokens..")
  }
}

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
  // here we have used the $or to find the user on the basis of either email or username
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
  // take the data from the req.body (form on the frontend)
  // On what basis you want the user to be logged in username,email.
  // find the user
  // password checker
  // access and refresh token
  // send cookie
  const {username,email,password}=req.body;
  if(!username || !email){
    throw new ApiError(400,"Username and Email is required");
  }
  const user=await User.findOne({
    $or:[{username},{email}]
  })
  if(!user){
    throw new ApiError(404,"User does not exist");
  }
  // pass checker
  const isPasswordValid=await user.isPasswordCorrect(password);
  if(!isPasswordValid){
    throw new ApiError(402,"Invalid User credentials");
  }

  // token generation
  const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);

  const loggedIn=await User.findById(user._id).select("-password -refreshToken")

  // setting options for the cookie
  const options={
    httpOnly:true,
    secure:true
  }
  return res.status(200).cookie("accessToken",accessToken).cookie("refreshToken",refreshToken).json(
    new ApiResponse(
      200,
      {
        user:loggedIn,accessToken,refreshToken
      },
      "User logged in Successfully"
    )
  )

} )

const logoutUser=asyncHandler(async(req,res)=>{
  // todos to logout a user
  // find the user by the id bu the prob is from where we get the ID
  // delete its cookies as they are of no use when logged out
  // remove the refresh token from the DB as we will be assingning him the new when he will login again.
  // finally he will be logged out
 const loggedOutUser=await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined
      }
    },{
      new:true
    }
  )
  const options={
    httpOnly:true,
    secure:true
  }
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User Logged out Successfully"))
  

})

export { registerUser,loginUser ,logoutUser };
