import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler( async (req ,res)=>{
      res.status(200).json({
        message : "CHai aur Code with Usman"
      })
})
export {registerUser}