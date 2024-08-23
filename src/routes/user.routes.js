import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { blockUser, deleteUser, followUser, unblockUser, unfollowUser } from "../controllers/user.controller.js";
const router = Router();
router.route("/follow-user/:userId").post(verifyJWT,followUser)
router.route("/unfollow-user/:userId").post(verifyJWT,unfollowUser)
router.route("/block-user/:userId").post(verifyJWT,blockUser)
router.route("/unblock-user/:userId").post(verifyJWT,unblockUser)
router.route("/delete-user").delete(verifyJWT,deleteUser)

export default router