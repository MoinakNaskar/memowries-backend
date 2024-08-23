import mongoose, {Schema} from "mongoose";

const storySchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        required:true,
        trim:true
    },
    image:{
        type:String,
        required:false
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60*60*24

    }
})

export const Story=mongoose.model("Story",storySchema)

