import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createComment, createCommentReply, deleteComment, deleteReplyComment, getCommentsByPost, updateComment, updateCommentReply } from "../controllers/comment.controller.js";
const router = Router();
router.route("/create-comment").post(verifyJWT,createComment)
router.route("/create-comment-reply/:commentId").post(verifyJWT,createCommentReply)
router.route("/update-comment/:commentId").put(verifyJWT,updateComment)
router.route("/update-comment-reply/:commentId/:replyId").put(verifyJWT,updateCommentReply)
router.route("/get-comments-by-post/:postId").get(verifyJWT,getCommentsByPost)
router.route("/delete-comment/:commentId").delete(verifyJWT,deleteComment)
router.route("/delete-comment-reply/:commentId/:replyId").delete(verifyJWT,deleteReplyComment)
export default router