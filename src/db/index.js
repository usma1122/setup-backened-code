import mongoose from "mongoose";
import { DB_Name } from "../constant.js";


export const connectDB = async ()=>{
  try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGOOSE_URI}/${DB_Name}`)
        console.log(`MongoDBConnect!! : ${connectionInstance.connection.host}`);
        
        
  } catch (error) {
    console.log("Mongodb Connection Failed : !!" , error);
    process.exit(1)
   
  }
}
