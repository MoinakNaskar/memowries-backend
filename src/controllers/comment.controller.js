
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const populateUserDetails=async(comments)=>{
    for(const comment of comments){
        await comment.populate("user","username fullName avatar")
        if(comment.replies.length>0){
            await comment.populate("replies.user","username fullName avatar")
        }
    }
}



const createComment = asyncHandler(
    async(req,res)=>{
        const {postId,text}=req.body
        const userId = req.user._id
        const post=await Post.findById(postId)
        if(!post){
            throw new ApiError(404,"Post not found")
        }
        const user=await User.findById(userId)
        if(!user){
            throw new ApiError(404,"User not found!")
        }

        const newComment=new Comment({
            user:userId,
            post:postId,
            text,
        })

        await newComment.save()
        post.comments.push(newComment._id)
        await post.save()

        res.status(201).json(new ApiResponse(201,newComment,'Comment added to the post '))
    }
)

const  createCommentReply = asyncHandler(
    async(req,res)=>{
        const {commentId}=req.params
    const {text}=req.body
    const userId = req.user._id
    const parentComment=await Comment.findById(commentId)
        if(!parentComment){
            throw new ApiError(404,"Parent comment not found!")
        }
        const user=await User.findById(userId)
        if(!user){
            throw new ApiError(404,"User not found!")

        }
        const reply={
            text,
            user:userId
        }
        parentComment.replies.push(reply)
        await parentComment.save()
        res.status(201).json(new ApiResponse(201,parentComment.reply,"Reply created successfully!"))

    }
)
const updateComment = asyncHandler(
    async(req,res)=>{
        const {commentId}=req.params
        const {text}=req.body
        const commentToUpdate=await Comment.findById(commentId)
        if(!commentToUpdate){
            throw new ApiError(404,"Comment not found!")
        } 
        const updatedComment=await Comment.findByIdAndUpdate(commentId,
            {text},{new:true})

        res.status(200).json(new ApiResponse(200,updatedComment,"Comment updated successfully!"))
       
    }
)
const updateCommentReply = asyncHandler(
    async(req,res)=>{
        const {commentId,replyId}=req.params
        const {text}=req.body
        const userId = req.user._id
        const comment=await Comment.findById(commentId)
        if(!comment){
            throw new ApiError(404,"Comment not found!")
        }

        const replyIndex=comment.replies.findIndex((reply)=>reply._id.toString()===replyId.toString())
        if(replyIndex===-1){
            throw new CustomError("Reply not found!",404)
        }
        if(comment.replies[replyIndex].user.toString()!==userId.toString()){
            throw new ApiError(404,"You can only update your comments")
        }
        comment.replies[replyIndex].text=text
        await comment.save()
        res.status(200).json(new ApiResponse(200,comment,"Reply updated successfully!"))
    }
)
const getCommentsByPost = asyncHandler(
    async(req,res)=>{
        const {postId}=req.params
        const post=await Post.findById(postId)
        if(!post){
            throw new ApiError(404,"Post not found!")
        }

        let comments=await Comment.find({post:postId})

        await populateUserDetails(comments)

        res.status(200).json(new ApiResponse(200,comments,"comments fetched successfully"))
    }
)

const deleteComment = asyncHandler(
    async(req,res)=>{
        const {commentId}=req.params
        const comment=await Comment.findById(commentId)
        if(!comment){
            throw new ApiError(404,"Comment not found!")
    }
    await Post.findOneAndUpdate(
        {comments:commentId},
        {$pull:{comments:commentId}},
        {new:true}
    )
    await comment.deleteOne()
    res.status(200).json(new ApiResponse(200,'Comment has been deleted!'))

}
)
const deleteReplyComment = asyncHandler(
    async(req,res)=>{
        const {commentId,replyId}=req.params
        const comment=await Comment.findById(commentId)
        if(!comment){
            throw new ApiError(404,"Comment not found!")
        }

        comment.replies=comment.replies.filter(id=>{
            id.toString()!==replyId.toString()
        })

        await comment.save()
        res.status(200).json(new ApiResponse(200,'Reply comment deletes successfully!'))
    }
)
export{
    createComment,
    createCommentReply,
    updateComment,
    updateCommentReply,
    getCommentsByPost,
    deleteComment,
    deleteReplyComment
}