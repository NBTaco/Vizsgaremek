import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./router";
import path from "path/win32";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
app.use('/kepek', express.static(path.join(__dirname, 'kepek')));

app.use("/", router);

export default app;