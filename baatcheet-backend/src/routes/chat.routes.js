import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createConversation, getMessages, getUserConversations, sendMessage, deleteConversation, deleteMessage } from "../controllers/chat.controller.js";

const router = Router();

router.use(verifyJWT)

router.route("/conversation").post(createConversation)
router.route("/conversations").get(getUserConversations)
router.route("/messages/:conversationId").get(getMessages)
router.route("/message").post(sendMessage)
router.route("/conversation/:conversationId").delete(deleteConversation)
router.route("/message/:messageId").delete(deleteMessage)

export default router;