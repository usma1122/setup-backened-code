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


// 2. Approch  for db connect another file to clean purpose
import dotenv from "dotenv"
import { connectDB } from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path: "./env"
})

const port = process.env.PORT || 8000
// database Successfull connection handle with .then and .catch 
connectDB()
   .then(()=>{
      app.on("error" ,(err)=>{
        console.log(err);
      app.listen(port ,()=>{
        console.log(`Server iS Running At ${port}`);  
      })
      })
   })
   .catch((err)=>{
     console.log(`DB Connection is Failed : ${err}`);
   })
// database Successfull connection handle with asynch and await
const serverConnect = async () => {
    try {
        await connectDB()
        app.on('error', (err) => {
            console.log(`App is connect with DB ${err}`);
            app.listen(port, () => {
                console.log(`App is listening on port ${port}`);
            })
        })
    } catch (error) {
        console.log("MongoDB Connectiion failed : ", error);

    }
}
serverConnect()