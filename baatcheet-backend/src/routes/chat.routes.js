import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createConversation, getMessages, getUserConversations, sendMessage } from "../controllers/chat.controller.js";

const router = Router();

router.use(verifyJWT)

router.route("/conversation").post(createConversation)
router.route("/conversations").get(getUserConversations)
router.route("/messages/:conversationId").get(getMessages)
router.route("/message").post(sendMessage)

export default router;