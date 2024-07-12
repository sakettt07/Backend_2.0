import {mongoose ,isValidObjectId} from "mongoose";
import { Video } from "../models/video.models.js";
import {User} from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {v2 as cloudinary} from "cloudinary"


const publishAVideo=asyncHandler(async(req,res)=>{
    const {title,description} =req.body;

    if(!title && !description){
        throw new ApiError(400,"All fields are required");
    }
    const videoLocalPath=req.files?.video[0]?.path;
    const thumbnailLocalPath=req.files?.thumbnail[0]?.path;

    if(!videoLocalPath){
        throw new ApiError(400,"video file is required");
    }
    if(!thumbnailLocalPath){
        throw new ApiError(400,"thumbnail file is required");
    }

    // uploaded on cloudinary.
    const videoFile=await uploadOnCloudinary(videoLocalPath)
    const thumbnailFile=await uploadOnCloudinary(thumbnailLocalPath)

    // saving it to the mongodb

    const video=await Video.create({
        video:videoFile.url,
        thumbnail:thumbnailFile.url,
        publicId:videoFile.public_id,
        title,description,
        duration:videoFile.duration,
        owner:req.user?._id,
    })
    const videoUploaded=await Video.findById(video?.id).select(-video -thumbnail -views -isPublished);
    if(!videoUploaded){
        throw new ApiError(400,"Video is not uploaded");
    }
    return res.status(200).json(new ApiResponse(200,videoUploaded,"video uploaded successfully"));
})
const getAllVideos=asyncHandler(async(req,res)=>{
    const {page=1,limit=10,sortBy="title",sortType="ascending",userId}=req.query;

    const pageNumber=parseInt(page);
    const pageLimit=parseInt(limit);
    const skip=(pageNumber-1)* pageLimit
    const sortIn=sortType==="ascending"?1:-1;
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "usedId is not found, userId is required !")
    }
    try {
        const videos = await Video.aggregate(
            [
                {
                    $match: {
                        owner: new mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                        pipeline: [
                            {
                                $project: {
                                    fullname: 1,
                                    username: 1,
                                    avatar: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: pageLimit
                },
                {
                    $sort: { [sortBy]: sortIn }
                }

            ])

        const totalVideos = await Video.countDocuments({ owner: userId })
        const totalPages = Math.ceil(totalVideos / pageLimit)

        return res
            .status(200)
            .json(
                new ApiResponse(200, { videos, totalPages, totalVideos }, "All videos fetched")
            )

    } catch (error) {
        throw new ApiError(400, "Error while fetching videos", error)
    }


})
const getVideoById = asyncHandler(async (req, res) => {
    const {videoId}=req.params;
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"videoId is not correct");
    }
    const video=await Video.findById(videoId);
    if(!video){
        throw new ApiError(404,"Video is not found or video id is not correct");
    }
    // now we have to increase the views of the video by looking at the watch history.
    const user=await User.findById(req.user?._id)
    if(!(user.watchHistory.includes(videoId))){
        await Video.findByIdAndUpdate(videoId,
            {
            $inc:{
                views:1
            }
        },{
            new:true
        })
    }
    // user ki history me add kardi videoid so it keeps track that the video has been viewed
    await User.findByIdAndUpdate(req.user?._id,
        {
            $addToSet:{
                watchHistory:videoId
            }
        },
        {new:true}
    )
    return res.status(200).json(new ApiResponse(200,video,"Video is fetched by videoId"));
})
const updateVideo=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;

    if(!videoId){
        throw new ApiError(400,"VideoId is not correct");
    }
    const video=await Video.findById(videoId);
    const publicId=video.publicId;
    if(!publicId){
        throw new ApiError(400,"publicId is not present");
    }
    if(publicId){
        try {
            // cloudinary s delete karni h video or new wali dalni h
            await cloudinary.uploader.destroy(publicId,{resource_type:"video"})
        } catch (error) {
            throw new ApiError(400,"Error while deleting the video file from cloudinary");
        }
    }
    // upload new file pon cloudinary:
    const videoLocalPath=req.file?.path;
    if(!videoLocalPath){
        throw new ApiError(400,"video file is required");
    }
    const newVideo=await uploadOnCloudinary(videoLocalPath);

    if(!newVideo.url){
        throw new ApiError(400,"Error while uploading the video on cloudinary.")
    }
    const updateVideo=await Video.findByIdAndUpdate(videoId,
        {
            $set:{
                video:newVideo.url,
                publicId:newVideo.public_id,
                duration:newVideo.duration
            }
        },
        {
            new:true
        }
    )
    return res.status(200).json(new ApiResponse(200,updateVideo,"Video updated successfully"));
})
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"videoid is not correct");
    }

    const video =await Video.findById(videoId);
    const publicId=video.publicId;
    if(publicId){
        try {
            await cloudinary.uploader.destroy(publicId,{resource_type:"video"});
        } catch (error) {
            throw new ApiError(400,"error while deleting the video from the cloudinary");
        }
    }
    // database m s bhi delete karo.
    await Video.findByIdAndDelete(videoId);
    return res.status(200,[],"video is deleted successfully");

})

export {publishAVideo,getAllVideos,getVideoById,updateVideo,deleteVideo};