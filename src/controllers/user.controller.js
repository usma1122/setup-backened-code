import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError}  from "../utils/ApiError.js"
import {User} from "../models/User.models.js"
import {uploadCloudinary} from "../utils/cloudinery.js"
import {ApiResponse} from "../utils/ApiResponse.js"
const registerUser = asyncHandler( async (req ,res)=>{
   
        
       // get user detail from frontend 
       //validation -not empty 
       //check if user already exist : username , email
       //check for image chack for avtar 
       // upload them to cloudinary  avta check 
       //creat user object 
       //remove password and refresh token field from response 
       //check user creation 
       // return response

       const {fullname , email, username, password , } = req.body
       console.log("Email" , email);
      //  if (fullname === "") {
      //   throw new ApiError( 400 , "Fullname is required")
      //  }
      if (
         [fullname , email , username , password].some((field)=> field?.trim() ==="")
      ) {
         throw new ApiError(400 , "All field are Required")
      }

     const existingUser = User.findOne({
        $or : [{ username },{ email }]
      })
      if (existingUser) {
         throw new ApiError(409 , "User with email or username already exist")
      }
      // req.files
      const avatarLocalPath = req.files?.avatar[0]?.path
      const coverImageLocalPath = req.files?.coverImage[0]?.path
      if (!avatarLocalPath) {
         throw new ApiError (400 , "Avatar Files is Required")
      }
    const avatar = await uploadCloudinary(avatarLocalPath)
     const coverImage = await uploadCloudinary(coverImageLocalPath)
     if (!avatar) {
      throw new ApiError (400 , "Avatar Files is Required")
     }
     const user = await  User.create({
      fullname ,
      avatar : avatar.url ,
      coverImage : coverImage?.url || "" ,
      email ,
      password ,
      username : username.toLowercase()
     })
    const createUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )
    if (!createUser) {
      throw new ApiError (500 , "Something Went Wrong while register a User")
    }
    return res.status(201).json(
      new ApiResponse(200 , createUser , "UserRegister Successfully")
    )
})
export {registerUser}

