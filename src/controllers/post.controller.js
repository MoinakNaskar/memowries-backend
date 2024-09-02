import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createPost = asyncHandler(
   async(req,res)=>{
    
    const {caption,lat,lng} = req.body
    const userId = req.user._id
    const  imagesLocal =  req.files.images
    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(404,"User not found!")
       } 
    

    if(!imagesLocal){
        throw new ApiError(500, "Something went wrong while posting images")
    }
    let imagesUrl =[]

     for( let i = 0; i < imagesLocal.length; i++){
        const imageUrl = await uploadOnCloudinary(imagesLocal[i].path)
        imagesUrl.push(imageUrl.url);
     }

 
    
    const post = await Post.create({
        user: userId,
        caption,
        images:imagesUrl,
        location:{
            type:"Point",
            coordinates:[parseFloat(lng),parseFloat(lat)]
          },

    });
    const createdPost = await Post.findById(post._id)
    if(!createdPost){
        throw new ApiError(500, "Something went wrong while posting images")
    }
    
    user.posts.push(createdPost._id)
    
    await user.save()


    return res.status(201).json(
        new ApiResponse(200, createdPost, "images posted successfully")
    )    

   }
)

export const updatePost = asyncHandler(
    async(req,res)=>{
        const {postId}=req.params
        console.log(postId)
     const {caption,lat,lng,locality} = req.body
     const postToUpdate=await Post.findById(postId)
     if(!postToUpdate){
        throw new ApiError(404,"post is not found ")
    }
    
    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {$set:{caption,
            location:{
                type:"Point",
                coordinates:[parseFloat(lng),parseFloat(lat)]  
            },
            locality


        }},
        { new: true }
      );
      return res.status(201).json(
        new ApiResponse(200, updatedPost, " post updated successfully")
    ) 
 
     })

     export const deletePost = asyncHandler(
        async(req,res)=>{
            const {postId}=req.params
            
         const postToDelete=await Post.findById(postId)
         if(!postToDelete){
            throw new ApiError(404,"post is not found ")
        }
        const user=await User.findById(postToDelete.user)
        if(!user){
            throw new ApiError(404,"User not found!")
        }
        user.posts=user.posts.filter(postId=>postId.toString()!==postToDelete._id.toString())
        await user.save()
        await postToDelete.deleteOne()
        await Comment.deleteMany({post:postId})
        

          return res.status(201).json(
            new ApiResponse(200, " post deleted successfully")
        ) 
     
         })
export const likePost = asyncHandler(
            async(req,res)=>{
                const {postId}=req.params
                
             const postToLike=await Post.findById(postId)
             if(!postToLike){
                throw new ApiError(404,"post is not found ")
            }
            const user=await User.findById(req.user._id)

            if(!user){
                throw new ApiError(404,"User not found!")
            }
            if(postToLike.likes.includes(user._id)){
                throw new ApiError(404,"You have already liked this post!")
            }
            postToLike.likes.push(user._id)
            await postToLike.save()

            
    
              return res.status(201).json(
                new ApiResponse(200, postToLike," post liked successfully")
            ) 
         
             })
 export const dislikePost = asyncHandler(
                async(req,res)=>{
                    const {postId}=req.params
    const userId=req.user._id
    
        const post=await Post.findById(postId)
        if(!post){
            throw new ApiError(404,"Post not found!")
        }
        const user=await User.findById(userId)
        if(!user){
            throw new ApiError(404,"User not found!")
        }
        if(!post.likes.includes(userId)){
            throw new ApiError(404,"You have not liked the post!")
        }
        
        post.likes=post.likes.filter(id=>id.toString()!==userId.toString())
        await post.save()
        res.status(200).json(
            new ApiResponse(200, post," post disliked successfully"))
    }
 )
 export const getUserPosts = asyncHandler(
    async(req,res)=>{
        const {userId}=req.params
        const user=await User.findById(userId)
        if(!user){
            throw new ApiError(404,"User not found!")
        }
        const userPosts=await Post.find({user:userId})
        res.status(200).json(
            new ApiResponse(200, userPosts," post fetched successfully"))


    }
 )
 export const getAllPosts = asyncHandler(
    async(req,res)=>{
        const userId=req.user._id
        const user=await User.findById(userId)
        if(!user){
            throw new ApiError(404,"User not found!")
        }
        const blockedUserIds=user.blockList.map(id=>id.toString())
        const allPosts=await Post.find({user:{$nin:blockedUserIds}}).populate("user","username fullName avatar")
        res.status(200).json(
            new ApiResponse(200, allPosts," posts fetched successfully"))

    }
 )



   
 
    
 
