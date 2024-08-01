import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Tweet} from "../models/tweet.models.js"


const createTweet=asyncHandler(async(req,res)=>{
    // TODO :
    // content toh hona chaiyee
    // valid user hona chaiyee
    // jab dono mil jae toh db m add karna h
    // potential check if not added

    const {content}=req.body;
    const userId=req.user?._id;
    if(!content || content.trim===""){
        throw new ApiError(400,"Add something to post");
    }
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"invalid user id")
    }

    // now we have got both the two fileds user and content we can push them into the database.
    const tweet=await Tweet.create({
        content,
        owner:userId
    })
    if(!tweet){
        throw new ApiError(402,"error while adding the tweet");
    }

    res.status(200).json(new ApiResponse(200,"new Tweet or post added to the community section"));
})

// assuming that there will be a button on the frontend side by clicking on which we can delete the tweet(double check)
const deleteTweet=asyncHandler(async(req,res)=>{
    // TODO:
    // valid user hona chaiye or valid tweetid honi chaiye
    // db m search karlenge tweet ko
    // agr apki tweet k owener ki or user ki id match kari toh tweet delete kardenge
    const {tweetId}=req.params;
    const {userId}=req.user?._id;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"invalid tweet id");
    }
    // db m check karo tweet
    const tweet=await Tweet.findById({
        tweetId
    })
    if(!tweet){
    throw new ApiError(400,"tweet not found")
    }
    if(tweet.owner.toString()===userId.tostring()){
        throw new ApiError(402,"you are not authorized to delete the tweet")
    }
    await tweet.remove();
    res.status(200).json(new ApiResponse(200,null,"tweet deleted successfully"));
})
const getUserTweets=asyncHandler(async(req,res)=>{
    // TODO: get the userId from the params or from the token we have saved
    // find the User in the tweets model 
    // get all the data of the particular user

    const {userId}=req.params;

    if(!isValidObjectId(userId)){
        throw new ApiError(400,"user is invalid");
    }
    const tweets=await Tweet.find({owner:userId});
    if(!tweets){
        throw new ApiError(400,"no such user found with this id");
    }
    res.status(200).json(new ApiResponse(200,tweets,"users tweets fetched successfully"));
})
const updateTweet=asyncHandler(async(req,res)=>{

    // TODO: get the userid from the params or token
    // find it in the tweets owner if user exist then change the content
    // return the new data from the tweet

    const {content}=req.body;
    const {userId}=req.params;
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"invalid user");
    }
    if(content.trim===""||!content){
        throw new ApiError(402,"write something to update");
    }

    const tweet=await Tweet.findByIdAndUpdate({owner:userId});
})

export {createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet}