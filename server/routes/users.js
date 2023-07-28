import express from "express";
import {
    getUser,
    getCurrentUser,
    getUserFriends,
    addRemoveFriend,
} 
from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ===== READ =====
router.get("/:id",verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/currentuser/:id",verifyToken, getCurrentUser)

// ===== UPDATE =====
// router.patch("/:id/:friendId", addRemoveFriend);
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;