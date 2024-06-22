// usersRouter.ts
import express from "express";

const resumeRouter = express.Router();

// Define a GET route
resumeRouter.get("/", (req, res) => {
  res.send("Users list");
});

// Define a POST route
resumeRouter.post("/", (req, res) => {
  res.send("Create user");
});

export { resumeRouter };
