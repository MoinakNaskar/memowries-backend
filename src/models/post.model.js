import mongoose, {Schema} from "mongoose";

const postSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    caption:{
        type:String,
        trim:true
    },
    locality:{
        type:String
    },
    location:{
        type:{type:String,required:true},
        coordinates:[]
    },
    images:[{
        type:String,
        required:false
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }]
},{timestamps:true})

export const Post=mongoose.model("Post",postSchema)
