import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createStory, deleteStories, deleteStory, getStories, getUserStories } from "../controllers/story.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
router.route("/create-story").post(upload.fields([
    {name : "image",
    maxCount: 1},
]),verifyJWT,createStory),
router.route("/get-stories").get(verifyJWT,getStories)
router.route("/get-user-stories/:userId").get(verifyJWT,getUserStories)
router.route("/delete-story/:storyId").delete(verifyJWT,deleteStory)
router.route("/delete-stories").delete(verifyJWT,deleteStories)
export default router