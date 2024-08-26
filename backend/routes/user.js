import { Router } from "express";
import { deleteUser, updateUser } from "../controller/user.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = Router();
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);

export default router;
