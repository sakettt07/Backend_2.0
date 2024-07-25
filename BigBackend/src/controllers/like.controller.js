import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.models.js";
import { User } from "../models/user.models.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"video is is not avaiable")
    }
    const video=await Video.findById(videoId);
    if(!video){
        throw new ApiError(404,"video not found");
    }
    if(isValidObjectId(req.user?._id)){
        throw new ApiError(400,"requested user id not found");
    }

    const user=await User.findById(req.user?._id);
    if(!user){
        throw new ApiError(404,"User not found with this id");
    }
    const isLiked=await Like.findOne({video:videoId,likedBy:req.user?._id});
    let isLikedStatus;    //this will change the like and dislike logic
    try {
        if(!isLiked){
            await Like.create({
                video:videoId,
                likedBy:req.user?._id
            })
            isLikedStatus={isLiked:true}
        }
        else{
            await Like.deleteOne(isLiked._id)
            isLikedStatus={isLiked:false}
        }
    } catch (error) {
        throw new ApiError(400, "Error while toggle video like", error)
    }
    return res.status(200).json(new ApiResponse(200,isLikedStatus,"Video liked successfully"))
})
// similar to the above function
const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"comment id is not available");
    }
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found with this commentId or Invalid commentId")
    }

    if (!req.user?._id) {
        throw new ApiError(404, "requested user Id not found")
    }

    const user = await User.findById(req.user?._id)

    if (!isValidObjectId(user)) {
        throw new ApiError(404, "User not found with this User Id")
    }
    const isLiked = await Like.findOne({ comment: commentId, likedBy: user?._id })

    let commentlikeStatus;
    try {
        if (!isLiked) {
            await Like.create({
                comment: commentId,
                likedBy: user?._id
            })

            commentlikeStatus = { isLiked: true }
        }
        else {
            await Like.deleteOne(isLiked._id)
            commentlikeStatus = { isLiked: false }
        }

    } catch (error) {
        throw new ApiError(400, "Error while toggle comment like", error)
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, commentlikeStatus, "Comment Like Toggle sucessfully")
        )

})
const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    if (!req.user?._id) {
        throw new ApiError(404, "requested user Id not found")
    }

    const user = await User.findById(req.user?._id)

    if (!isValidObjectId(user)) {
        throw new ApiError(404, "User not found with this User Id")
    }
    const likedVideos=await Like.aggregate(
        [
            {
                // primarily match that user has liked video or not in liked id array.
                $match:{
                    likedBy:new mongoose.Types.ObjectId(req.user?._id)
                }
            },
            {
                $match:{
                    video:{
                        $exists:true
                    }
                }
            }
        ])
})

export {
    toggleCommentLike,
    toggleVideoLike,
    getLikedVideos
}