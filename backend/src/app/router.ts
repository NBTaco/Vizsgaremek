import { Router } from "express";
import { loginUser, registerUser, run, userSettings } from "./controller";
import verifyToken from "../middleware/auth"

const router = Router();

router.get("/", router);
router.get("/", run);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/user", userSettings, verifyToken);

export default router;