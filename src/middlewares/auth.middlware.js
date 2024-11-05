import { User } from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jsonwebtoken from "jsonwebtoken"


export const verifyJwt = asyncHandler(async (req , _, next )=>{
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    console.log(token);
    
    if (!token) {
       throw new ApiError(401 , "Unautherizer Access")
    }
    const decodedToken = await jsonwebtoken.verify(token , process.env.ACCESS_TOKEN_SECRET)
  
    //    await User.findOne({ _id: decodedToken._id });
 
   const user =  await User.findById(
     decodedToken._id
    ).select("-password -refreshToken")
 console.log(user);
 
    if(!user){
     // TODO : Discuss About Frontend
     throw new ApiError(401 , "invalid Accss Token")
    }
 
    req.user = user;
    next()
  } catch (error) {
     throw new ApiError(401 , error?.message || "invalid Access Token ")
  }
})