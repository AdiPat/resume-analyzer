import "./commons/config";
import express from "express";
import bodyParser from "body-parser";
import { APP_NAME, APP_PORT } from "./commons/constants";
import { resumeRouter } from "./routers";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/resume", resumeRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(APP_PORT, () => {
  console.log(`${APP_NAME} app listening on port ${APP_PORT}`);
});

export { app };
