// usersRouter.ts
import express from "express";
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const resumeRouter = express.Router();

resumeRouter.post(
  "/upload",
  upload.single("file"),
  (req: express.Request, res: express.Response) => {
    console.log("Uploaded file:", req.file);
    res.send("File uploaded successfully.");
  }
);

// Define a GET route
resumeRouter.get("/", (req, res) => {
  res.send("Users list");
});

// Define a POST route
resumeRouter.post("/", (req, res) => {
  res.send("Create user");
});

export { resumeRouter };
