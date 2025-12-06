import { Router } from "express";
import { loginUser, registerUser, run } from "./controller";

const router = Router();

router.get("/", router);
router.get("/", run);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;