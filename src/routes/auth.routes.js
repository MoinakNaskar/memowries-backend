import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js "
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/register-user').post(
    upload.fields([
        {name : "avatar",
        maxCount: 1},
        {
        name : "coverImage",
        maxCount: 1
        }
    ]),
    registerUser


)
router.route('/login-user').post(
    loginUser
)
router.route('/get-user').post(
    verifyJWT, getCurrentUser
)

router.route('/logout-user').get(
    verifyJWT , logoutUser
)
export default router 