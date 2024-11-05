import { Router } from "express";
import { loginUser, logoutUser, registerUser ,refreshAccesToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middlware.js";
const router = Router()


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)


// secure route  means user login hu ga 
router.route("/logout").post( verifyJwt ,logoutUser)
router.route("/refresh-token").post( refreshAccesToken)

export default router

































// router.route("/register").post(
//     upload.fields([
//         {
//             name : "avatar" ,
//             maxCount : 1
//         },
//         {
//             name : "coverImage" ,
//             maxCount : 1
//         }
//     ]),
//     registerUser)