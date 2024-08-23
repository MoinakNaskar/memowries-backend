import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import { Post } from "../models/post.model.js";
import { Story } from "../models/story.model.js";
import { Comment } from "../models/comment.model.js";


const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    //TODO: delete old image - assignment


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image updated successfully")
    )
})

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})
const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});
const followUser = asyncHandler(
    async(req,res)=>{
        const {userId} = req.params
        const {_id}=req.user._id
        if(userId===_id){
            throw new ApiError(400,"You can not follow yourself")
        }
        const userToFollow=await User.findById(userId)
        const loggedInUser=await User.findById(_id)
        if(!userToFollow || !loggedInUser){
            throw new ApiError(404,"User not found!")
        }
        if(loggedInUser.following.includes(userId)){
            throw new ApiError(400,"Already following this user!")
        }
        loggedInUser.following.push(userId)
        userToFollow.followers.push(_id)
        await loggedInUser.save()
        await userToFollow.save()

        res.status(200).json({message:"Successfully followed user!"})



    }
)
const unfollowUser = asyncHandler(
    async(req,res)=>{
        const {userId} = req.params
        const {_id}=req.user._id
        if(userId===_id){
            throw new ApiError(500,"You can not unfollow yourself")
        }

        const userToUnfollow=await User.findById(userId)
        const loggedInUser=await User.findById(_id)

      

        if(!userToUnfollow || !loggedInUser){
            throw new ApiError(404,"User not found!")
        }

        if(!loggedInUser.following.includes(userId)){
            throw new ApiError(400,"Not following this user",)
        }

        loggedInUser.following=loggedInUser.following.filter(id=>id.toString()!==userId.toString())
        userToUnfollow.followers=userToUnfollow.followers.filter(id=>id.toString()!==_id.toString())

        await loggedInUser.save()
        await userToUnfollow.save()

        res.status(200).json({message:"Successfully unfollowed user!"})




    }
)
const blockUser = asyncHandler(
    async(req,res)=>{
        const {userId} = req.params
        const {_id}=req.user._id
        if(userId===_id){
            throw new CustomError("You can not block yourself",500)
        }

        const userToBlock=await User.findById(userId)
        const loggedInUser=await User.findById(_id)

        if(!userToBlock || !loggedInUser){
            throw new ApiError(404,"User not found!")
        }

        if(loggedInUser.blockList.includes(userId)){
            throw new ApiError(400,"This user is already blocked!")
        }

        loggedInUser.blockList.push(userId)

        loggedInUser.following=loggedInUser.following.filter(id=>id.toString()!==userId)
        userToBlock.followers=userToBlock.followers.filter(id=>id.toString()!==_id)

        await loggedInUser.save()
        await userToBlock.save()

        res.status(200).json({message:"Successfully blocked user!"})





    }
)
const unblockUser = asyncHandler(
    async(req,res)=>{
        const {userId} = req.params
        const {_id}=req.user._id
        if(userId===_id){
            throw new ApiError(500,"You can not unblock yourself")
        }

        const userToUnblock=await User.findById(userId)
        const loggedInUser=await User.findById(_id)

        if(!userToUnblock || !loggedInUser){
            throw new ApiError(400,"User not found!")
        }

        if(!loggedInUser.blockList.includes(userId)){
            throw new ApiError(400,"Not blocking is user!")
        }

        loggedInUser.blockList=loggedInUser.blockList.filter(id=>id.toString()!=userId.toString())

        await loggedInUser.save()
        
        res.status(200).json({message:"Successfully unblocked user!"})





    }
)
const deleteUser = asyncHandler(
    async(req,res)=>{
       const  userId = req.user._id
       const userToDelete=await User.findById(userId)

        if(!userToDelete){
            throw new ApiError(404,"User not found!",)
        }

        await Post.deleteMany({user:userId})
        await Post.deleteMany({"comments.user":userId})
        await Post.deleteMany({"comments.replies.user":userId})
        await Comment.deleteMany({user:userId})
        await Story.deleteMany({user:userId})
        await Post.updateMany({likes:userId},{$pull:{likes:userId}})
        await User.updateMany(
            {_id:{$in:userToDelete.following}},
            {$pull:{followers:userId}})
        await Comment.updateMany({},{$pull:{likes:userId}})
        await Comment.updateMany({"replies.likes":userId},{$pull:{"replies.likes":userId}})
        await Post.updateMany({},{$pull:{likes:userId}})

        const replyComments=await Comment.find({"replies.user":userId})

        await Promise.all(
            replyComments.map(async(comment)=>{
                comment.replies=comment.replies.filter((reply)=>reply.user.toString()!=userId.toString())
                await Comment.save()
            })
        )

        await userToDelete.deleteOne()
        res.status(200).json({message:"Everything associated with user is deleted successfully!"})

    }
)
export {

    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    followUser,
    unfollowUser,
    blockUser,
    unblockUser,
    deleteUser
        
}


