import { Router } from "express";
import { updateUser } from "../controller/user.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = Router();
router.put("/update/:userId", verifyToken, updateUser);

export default router;
