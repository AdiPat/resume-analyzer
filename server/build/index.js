import "./commons/config";
import express from "express";
import bodyParser from "body-parser";
import { APP_NAME, APP_PORT } from "./commons/constants";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(APP_PORT, () => {
    console.log(`${APP_NAME} app listening on port ${APP_PORT}`);
});
