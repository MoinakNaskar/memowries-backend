import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const userSchema = new Schema({
    userName:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    fullName:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    links:[
        {
            type:String,
            trim: true,

        }
    ],
    description:{
        type:String
    },
    userType:{
        type:String,
        required: true
    },
    
    avatar:{
        type:String,
        

        
    },
    gender:{
        type:String,
        required:true,
        trim:true, 
    },
    mobileNo:{
        type:Number,
        required:true,
        trim:true,
        unique:true,
    },
    coverImage:{
        type: String
    },
    bookimgHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "Booking"
        }
    ],
    password:{
        type: String,
        required: [true, "password is required"]

    },
    refreshToken:{
        type: String
    },
    location:{
        type:{type:String,required:true},
        coordinates:[]
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    blockList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
    
        
    
},{
    timestamps: true
})
userSchema.index({location:"2dsphere"})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema)