import mongoose, {Schema} from "mongoose";

const bookingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    partners:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }],
    location:{
        type:{type:String,required:true},
        coordinates:[]
    },
    address:{
        type: String,
        required:true
    },
    bookingInstruction:{
        type: String,
         
    },
    bookingType:{
        type: String,
        required:true 
    },
    bookingStatus:{
        type: String,
        required:true
    },
    

}
)
export const Booking=mongoose.model("Booking",bookingSchema)