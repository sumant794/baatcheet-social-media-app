import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleLike, checkUserLiked } from "../controllers/like.controller.js";

const router = Router();

router.use(verifyJWT);

// Toggle like on a post (like/unlike)
router.route("/:postId/toggle").post(toggleLike);

// Check if current user liked a post
router.route("/:postId/status").get(checkUserLiked);

export default router;
