import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./router";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

app.use("/", router);

export default app;