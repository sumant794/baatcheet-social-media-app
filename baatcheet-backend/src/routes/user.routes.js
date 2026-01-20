import { Router } from "express";
import { 
    changeCurrentPassword,
    getCurrentUser,
    getUserProfile,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    removeAvatar,
    searchUsers,
    toggleFollow,
    updateAvatar,
    updateBio,
    updateEmail,
    updateFullName,} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-email").patch(verifyJWT, updateEmail)
router.route("/update-fullname").patch(verifyJWT, updateFullName)
router.route("/update-bio").patch(verifyJWT, updateBio)
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar)
router.route("/remove-avatar").patch(verifyJWT,  removeAvatar)
router.route("/f/:accountId").post(verifyJWT, toggleFollow)
router.route("/search").get(verifyJWT, searchUsers)
router.route("/u/:userId").get(verifyJWT, getUserProfile)

export default router;