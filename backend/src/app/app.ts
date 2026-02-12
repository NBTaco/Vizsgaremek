import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./router";
import path from "path";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
const imagesPath = path.resolve(__dirname, "..", "..", "kepek");
const imagesPathFallback = path.resolve(__dirname, "kepek");
app.use("/kepek", express.static(imagesPath));
app.use("/kepek", express.static(imagesPathFallback));

app.use("/", router);

export default app;