import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/User.models.js"
import { uploadCloudinary } from "../utils/cloudinery.js"
import { ApiResponse } from "../utils/ApiResponse.js"

// Acces and refresh token hum issy seperate method me dal dy gy 
// The validateBeforeSave: false option in Mongoose tells Mongoose not to check if the data is valid before saving it to the database. By default, Mongoose will always check that data is correct (like required fields are filled out) when you save. 
const generateAccesAndRefreshTokens = async (userId) => {
   try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generaterefreshToken()

      user.refreshToken = refreshToken
      await user.Save({ validateBeforeSafe: false })
      return { accessToken, refreshToken }
   } catch (error) {
      throw new ApiError(500, "Something Went Wrong While generating refesh and acces Token")
   }
}


const registerUser = asyncHandler(async (req, res) => {


   // get user detail from frontend 
   //validation -not empty 
   //check if user already exist : username , email
   //check for image chack for avtar 
   // upload them to cloudinary  avta check 
   //creat user object 
   //remove password and refresh token field from response 
   //check user creation 
   // return response
   console.log(req.body);

   const { fullname, email, username, password, } = req.body
   console.log("Email", email);
   //  if (fullname === "") {
   //   throw new ApiError( 400 , "Fullname is required")
   //  }
   if (
      [fullname, email, username, password].some((field) => field?.trim() === "")
   ) {
      throw new ApiError(400, "All field are Required")
   }

   const existingUser = await User.findOne({
      $or: [{ username }, { email }]
   })
   if (existingUser) {
      throw new ApiError(409, "User with email or username already exist")
   }
   // req.files
   // const avatarLocalPath = req.files?.avatar[0]?.path;
   // const coverImageLocalPath = req.files?.coverImage[0]?.path;

   //  let coverImageLocalPath;
   //  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0) {
   //    coverImageLocalPath = req.files.coverImage[0].path
   //  }

   // if (!avatarLocalPath) {
   //    throw new ApiError (400 , "Avatar Files is Required")
   // }

   //  const avatar = await uploadCloudinary(avatarLocalPath)
   //   const coverImage = await uploadCloudinary(coverImageLocalPath)
   //   if (!avatar) {
   // throw new ApiError (400 , "Avatar Files is Required")
   //   }
   const user = await User.create({
      fullname,
      // avatar : avatar.url ,
      // coverImage : coverImage?.url || "" ,
      email,
      password,
      username: username.toLowerCase()
   })
   const createUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )
   if (!createUser) {
      throw new ApiError(500, "Something Went Wrong while register a User")
   }
   return res.status(201).json(
      new ApiResponse(200, createUser, "UserRegister Successfully")
   )
})
const loginUser = asyncHandler(async (req, res) => {
   // req body --> data
   // validate username or email 
   // find the user 
   // password check 
   //acces and refres toeken generate 
   // send token in cookies 
   //response 
   const { email, username, password } = req.body
   if (!username || !email) {
      throw new ApiError(400, "Username and email is required")
   }
   const user = await User.findOne({
      $or: [{ username }, { email }]
   })
   if (!user) {
      throw new ApiError(404, "User does not exist")
   }

   const isPasswordValid = await user.isPasswordCorrect(password)
   if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user Credential")
   }

   const { accessToken, refreshToken } = await generateAccesAndRefreshTokens(user._id)
   // we call the db bcz the user has null refresh token and we want this user they have refresh token and this way we call the db again 
   const loggedInUser = await User.findById(user._id)
      .select("-password , -refreshToken")
   // cookie cannot modify in frontend they only modify in server when we use this object property
   const options = {
      httpOnly: true,
      secure: true,
   }

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
         new ApiResponse(
            "201",
            {
               // yha hum is leye wo case handle handle krrhy rhy hy k user apni traf se accesss or refresh token save krna chaa rha hy localstorage me hu sakhta hy o mobile app develpment kr rha hu tu wha cookie set nahi hu rhi 
               user: loggedInUser, accessToken, refreshToken
            },
            "User Successfully login"

         )
      )
})
const logoutUser = asyncHandler(async (req, res) => {
  await  User.findbyIdAndUpdate(
      req.user?._id,
      {
         $set: {
            refreshtOken: undefined,

         }
      },
      {
         new: true
      }
   )
   const options = {
      httpOnly: true,
      secure: true,
   }
   return res
   .status(200)
   .clearCookie("accessToken" , options)
   .clearCookie("refereshToken" , options)
   .json(new ApiError(201 , {} , "UserLogoutSuccesfully "))
})
export { registerUser, loginUser, logoutUser }

