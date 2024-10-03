// import {express} from "express"
// import mongoose from "mongoose"
// import {DB_Name}  from "./constant"


//1. fist Approach and basic approach 
 /* function dbConnect(){
       simple Approach to connect a database 
}
dbConnect()  */

// IIFE Approach 
/* const app = express()
(async ()=>{
   try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
    app.on("error" , (error)=>{
        console.log("error : " , error.messege);
        throw error
    })
    app.listen(process.env.PORT , ()=>{
        console.log(`App is listening on port ${process.env.PORT}`);  
    })
   }
   catch (error) {
      console.log("ERROR :" , error);
       throw error
   }

})()   */


// 2. Approch 
import dotenv from "dotenv"
import { connectDB } from "./db/index.js"

dotenv.config({
    path : "./env"
})

connectDB ()