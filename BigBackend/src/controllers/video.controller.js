import {mongoose ,isValidObjectId} from "mongoose";
import { Video } from "../models/video.models";
import {User} from "../models/user.models";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


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
const getVideoById = asyncHandler(async (req, res) => {})
export {publishAVideo,getAllVideos,getVideoById};