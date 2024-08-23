import { Story } from "../models/story.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createStory = asyncHandler(
    async(req,res)=>{
        const userId = req.user._id
        const {text} = req.body 
        const user=await User.findById(userId)
        if(!user){
            throw new ApiError(404,"No user found")
        }
        let imageLocal
        if(req.files.image){
            imageLocal= req.files.image[0].path
        }
        const imageUploaded = await uploadOnCloudinary(imageLocal)
        
        if(!imageUploaded){
            throw new ApiError(500,"Having trouble to upload ") 
        }
        const newStory=new Story({
            user:userId,
            image:imageUploaded.url,
            text
        })
        await newStory.save()
        res.status(200).json(new ApiResponse(200,newStory,'Story Created Successfully'))

    }
)
const getStories = asyncHandler(
    async(req,res)=>{
        const userId=req.user._id;
        console.log(userId)
        const user=await User.findById(userId)
        if(!user){
            throw new ApiError(404,"No user found")
        }
        const followingUsers=user.following
        const stories=await Story.find({user:{$in:followingUsers}})
        .populate("user","fullName username profilePicture")

        res.status(200).json(new ApiResponse(200,stories,"Stories Fetched Successfully"))
    }
)
const getUserStories = asyncHandler(
    async(req,res)=>{
        const {userId}=req.params
        
        const user=await User.findById(userId)
     
        if(!user){
            throw new ApiError(404,"No user found")
        }
        const stories=await Story.find({user:userId})
        .populate("user","fullName username avatar _id")

        res.status(200).json(new ApiResponse(200,stories,"users stories fetched successfully"))

    
    }
)
const deleteStory = asyncHandler(
    async(req,res)=>{
        const storyId=req.params.storyId
        const story = await Story.findById(storyId)
        if(!story){
            throw new ApiError(404,"No story not found")  
        }

        await Story.findByIdAndDelete(storyId)
        
        res.status(200).json(new ApiResponse(200,'Story has been deleted!'))

    }
)
const deleteStories = asyncHandler(
    async(req,res)=>{
        const userId=req.user._id
        const user=await User.findById(userId)
        if(!user){
            throw new ApiError(404,"No user found")
            
        }
        const story = await Story.find({user:userId})
        if(story.length===0){
            throw new ApiError(404,"No story not found")
        }
        await Story.deleteMany({user:userId})
        res.status(200).json(new ApiResponse(200,'Stories has been deleted!'))

    }

)


export{
    createStory,
    getStories,
    getUserStories,
    deleteStory,
    deleteStories
}