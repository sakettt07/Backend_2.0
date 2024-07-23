import { isValidObjectId } from "mongoose"
import {asyncHandler} from "../utils/asyncHandler.js"
import {   playlist } from "../models/playlist.models.js"
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    const checkPlaylist=await playlist.findOne({name,description});
    if(checkPlaylist){
        throw new ApiError(400,"Playlist with this name is already exist");
    }
    // all fields are required potential check
    if(!(name || description)){
        throw new ApiError(400,"name ad description is required");
    }
    if([name,description].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"name and description should not be empty");
    }
    // user toh hone chaiye na 
    if(!req.user?._id){
        throw new ApiError(401,"User Id is not available");
    }
    const playlist=await playlist.create({
        name,description,owner:req.user._id
    })
    return res.status(200).json(new ApiResponse(200,"Playlist created successfully"));
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!playlistId){
        throw new ApiError(400,"playlist id is required");
    }
    const userPlaylist=await playlist.findById(playlistId);
    const playlistDelete=await playlist.deleteOne({name:userPlaylist.name,description:userPlaylist.description});

    if(!playlistDelete){
        throw new ApiError(400,"error while deleting the playlist");
    }
    return res.status(200).json(new ApiResponse(200,"playlist deleted"));
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!playlistId){
        throw new ApiError(400,"playlstId is required");
    }
    const updatedPlaylist=await playlist.findByIdAndUpdate(playlist,
        {
            $set:{
                name,description
            }
        },
        {new:true}
    )
    if(!updatePlaylist){
        throw new ApiError(400,"error while updating the playlist");
    }
    return res .status(200),json(new ApiResponse(200,"Playlist updated successfully"));

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}