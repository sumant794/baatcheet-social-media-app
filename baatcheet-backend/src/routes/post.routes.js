import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createPost, deletePost, getFeed, getPostById, getUserPosts, updatePost } from "../controllers/post.controller.js";

const router = Router();

router.use(verifyJWT)

router.route("/create").post(upload.single("image"), createPost)
router.route("/:postId").get(getPostById).delete(deletePost)
router.route("/user/:userId").get(getUserPosts)
router.route("/update-post/:postId").patch(updatePost)
router.route("/f/feed").get(getFeed)

export default router;