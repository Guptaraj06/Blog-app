import { Router } from "express";
import {
  deleteUser,
  updateUser,
  signout,
  getUsers,
} from "../controller/user.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = Router();
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.get("/signout", signout);
router.get("/getusers", verifyToken, getUsers);
export default router;
