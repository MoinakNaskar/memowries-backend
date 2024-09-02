import { asyncHandler } from "../utils/asyncHandler.js";

export const createKyc = asyncHandler(
    async(req,res)=>{
        const {userId , camera  }= req.body
    }
)