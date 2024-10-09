import mongoose from "mongoose";
import { Schema } from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt"
const userSchema = Schema({
    username : {
        type: String ,
        required : true ,
        unique : true ,
        lowercase : true ,
        trim : true ,  
        index:true ,      
    },
    email : {
        type: String ,
        required : true ,
        unique : true ,
        lowercase : true ,
        trim : true ,  
    },
    fullname : {
        type: String ,
        required : true ,
        trim : true ,  
        index: true 
    },
    avatar : {
        type: String , // cloudinary Aws
        required : true ,
    },
    coverImage : {
        type: String , // cloudinary Aws
    },
    watchHistory : [
        {
          type : Schema.Types.ObjectId ,
          ref : "Video"
        }
    ],
    password : {
       type : String ,
       required : [true , "Password is required"]
    },
    refreshToken : {
       type : String
    }
},{timestamps : true})

userSchema.pre('save' , async function(next){
   if (!this.isModified("password")) return next ()
   this.password = bcrypt.hash(this.password , 10)
   next()
})
userSchema.methods.isCorrectPassword = async function(password){
    return await bcrypt.compare(password , this.password)
}
userSchema.methods.generateAccessToken=function(){
    jsonwebtoken.sign(
        {
            _id : this._id ,
            username : this.username ,
            fullname : this.fullname  ,
            email : this.email  ,
        } ,
        process.env.ACCESS_TOKEN_SECRET ,
        {
              expiresIn : process.env.ACCESS_TOKEN_EXPIRY 
        }
    )
}
userSchema.methods.generaterefreshToken=function(){
    jsonwebtoken.sign(
        {
            _id : this._id ,
          
        } ,
        process.env.REFRESH_TOKEN-SECRET ,
        {
              expiresIn : process.env.REFRESH_TOKEN_EXPIRY 
        }
    )
}

export const User = mongoose.model("User" , userSchema)