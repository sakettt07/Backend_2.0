import { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "video Id is not available")
}

const video = await Video.findById(videoId)
if (!video) {
    throw new ApiError(404, "Video not found with this video Id or Invalid video Id")
}
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { content } = req.body;
  const { videoId } = req.params;

  // user hoga tabhi toh comment hoga
  if (!req.user?._id) {
    throw new ApiError(400, "requested user not found");
  }
  const user = await User.findById(req.user?._id);
  if (!isValidObjectId(user)) {
    throw new ApiError(400, "User with this id do not exist");
  }
  if (content.trim() === "") {
    throw new ApiError(400, "content is required");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "video id is not available");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video with this id not found");
  }
  const comment = await Comment.create({
    content,
    owner: req.user?._id,
    video: videoId,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { newContent } = req.body;
  if (newContent.trim() === "") {
    throw new ApiError(400, "content is required");
  }
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "invalid id or not available");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(400, "comment not found with this id");
  }
  const updateComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: newContent,
      },
    },
    {
      new: true,
    }
  );
  if (!updateComment) {
    throw new ApiError(400, "error while updating the comment");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const {commentId}=req.params;
  if(!isValidObjectId(commentId)){
    throw new ApiError(400,"Invalid video id or not available");
  }
  const comment=await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found with this comment Id")
}

const deleteComment = await Comment.findByIdAndDelete(commentId)

if (!deleteComment) {
    throw new ApiError(400, "Error while deleting comment")
}

return res
    .status(200)
    .json(
        new ApiResponse(200, deleteComment, "Comment delted Sucessfully !")
    )
});

export { getVideoComments, addComment, updateComment, deleteComment };
