import mongoose, {Schema} from "mongoose";
const kycSchema = new mongoose.Schema(
    {
        personalDetails:{
            adharNo:{
            type:Number,
            required:true
        },
        panNo:{
            type:String,
            required:true           
        },
        fatherName:{
            type:String,
            required:true           
        },
        experience:{
            type:Number,
        },
        dob:{
            type:String,
            required:true                
        }
    },  addressDetails:{
        location:{
            type:{type:String,required:true},
            coordinates:[]
        },
        house:{
            type:String,
            required:true    
            
        },

        locality:{
            type:String,
            required:true    
            
        },

        state:{
            type:String,
            required:true             
        },
        pincode:{
            type:Number,
            required:true            
        },
        country:{
            type:String,
            required:true 
        }

    },
    equipmentDetails:{
        cameras:[
            {
                Model:{
                    type:String,
                               
                },
                Type:{
                    type:String
                }
            }
        ],
        Drones:[
            {
                Model:{
                    type:String,
                               
                },                
            }
        ],
        lenses:[
            {
                
            }
        ]
    }


    },{

    }
)