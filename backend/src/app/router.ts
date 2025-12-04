import { Router } from "express";
import app from "./app";
import { run } from "./controller";

const router = Router();

app.use("/", router);
app.use("/", run);

export default router;