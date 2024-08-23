import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createPost, deletePost, dislikePost, getAllPosts, getUserPosts, likePost, updatePost } from "../controllers/post.controller.js";
const router = Router();

router.route('/create-post').post(verifyJWT,
    upload.fields([
        {name : "images",
        maxCount: 3},
    ]),
    createPost
)
router.route('/update-post/:postId').put(verifyJWT,updatePost)
router.route('/delete-post/:postId').delete(verifyJWT,deletePost)
router.route('/like-post/:postId').post(verifyJWT,likePost)
router.route('/dislike-post/:postId').post(verifyJWT,dislikePost)
router.route('/get-user-posts/:userId').get(verifyJWT,getUserPosts)
router.route('/get-all-posts/:userId').get(verifyJWT,getAllPosts)
export default router