import { User } from "../models/User.models";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jsonwebtoken from "jsonwebtoken"


export const verifyJwt = asyncHandler(async (req , _, next )=>{
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    if (!token) {
       throw new ApiError(401 , "Unautherizer Access")
    }
    const decodedToken = await jsonwebtoken.verify(token , process.env.ACCESS_TOKEN_SECRET)
 //    await User.findOne({ _id: decodedToken._id });
 
   const user =  await User.findbyId(
     decodedToken._id
    ).select("-password -refreshToken")
 
    if(!user){
     // TODO : Discuss About Frontend
     throw new ApiError(401 , "invalid Accss Token")
    }
 
    req,user = user;
    next()
  } catch (error) {
     throw new ApiError(401 , error?.message || "invalid Access Token ")
  }
})