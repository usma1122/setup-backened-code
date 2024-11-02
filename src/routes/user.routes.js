import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middlware.js";
const router = Router()


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)


// secure route
router.route("/logout").post( verifyJwt ,logoutUser)

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