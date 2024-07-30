import { isValidObjectId,mongoose } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Subscription} from "../models/subscription.models.js"


const toggleSubscription=asyncHandler(async(req,res)=>{
    const {channelId}=req.params;
    if(isValidObjectId(channelId)){
        throw new ApiError(400,"channel id is not available");
    }
    // channel id check karli
    if(!req.user?._id){
        throw new ApiError(400,"invalid user");
    }
    // user id check karli.
    const subscriberId=req.user?._id;
    // agr user subscribed hoga toh channel or subscription chek karlo.
    const isSubscribed=await Subscription.findOne({
        channel:channelId,
        subscriber:subscriberId
    })
    let subscriptionStatus;
    try {
        // agr subscribed hai toh unsubscribe karado kyuki toggle h
        if(isSubscribed){
            await Subscription.deleteOne({_id:isSubscribed._id})
            subscriptionStatus:{isSubscribed:false}
        }
        // nhi h toh kardo
        else{
            await Subscription.create({
                channel:channelId,
                subscriber:subscriberId
            })
            subscriptionStatus={isSubscribed:true}
        }
    } catch (error) {
        new ApiError(400,"Error while toggle",error);
    }
    return res.status(200).json(new ApiResponse(200,subscriptionStatus,"toggle Subscrition successfully"))
    
})
// basically hume channel list deni h jisme user n subscrivbe karrakha h
const getSubscribedChannels=asyncHandler(async(req,res)=>{
    const {subscriberId}=req.params;
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(401,"Invalid subscriber Id")
    }

    const userChannel=await Subscription.aggregate([
        {
            $match:{
                subscriber:new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField: "_id",
                    as: "subscribedTo",
                    pipeline: [
                        {
                            $project: {
                                fullname: 1,
                                username: 1,
                                isSubscribed: 1
                            }
                        }
                    ]
            }
        },
        {
            $addFields:{
                subscribedTo:{
                    $first:"$subscribedTo"
                }
            }
        }
    ])
    const channelList=userChannel.map(i=>i,subscribedTo)
    return res.status(200).json(new ApiResponse(200,channelList,"subscribed channels fetched"))
})
const getUserChannelSubscribers=asyncHandler(async(req,res)=>{
    const {channelId}=req.params;
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"invalid channel id");
    }
    const userSubscribers=await Subscription.aggregate([
        {
            $match:{
                channel:new mongoose.Types.ObjectId(channelId),
            }
        },
        {
            $group: {
                _id: null,
                totalSubscribers: {
                    $sum: 1
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalSubscribers: 1
            }
        }
    ])
    return res
        .status(200)
        .json(
            new ApiResponse(200, userSubscribers[0] || { subscribers: 0 }, "subscribers fetched sucessfully !")
        )
})



export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}