import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getPostComments } from "../controllers/comment.controller.js";

const router = Router();

router.use(verifyJWT);

// Add comment to a post
router.route("/:postId/add").post(addComment);

// Delete a comment
router.route("/:commentId/delete").delete(deleteComment);

// Get all comments for a post
router.route("/:postId").get(getPostComments);

export default router;
