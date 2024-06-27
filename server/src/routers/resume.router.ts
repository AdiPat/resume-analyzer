// usersRouter.ts
import { s3 } from "../commons/config";
import express from "express";
import multer from "multer";
import { nanoid } from "nanoid";
import { StatusCodes } from "http-status-codes";
import { db } from "../core";

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const resumeRouter = express.Router();

resumeRouter.post(
  "/upload",
  upload.single("file"),
  async (req: express.Request, res: express.Response) => {
    const uploadId = nanoid();

    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "No file uploaded.",
      });
    }

    const bucketName = process.env.AWS_BUCKET_NAME;

    if (!bucketName) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "AWS bucket name is not defined.",
      });
    }

    const params = {
      Bucket: bucketName, // The name of your S3 bucket
      Key: `resumes/${uploadId}_${req.file.originalname}`, // File name you want to save as
      Body: req.file.buffer, // The file binary data
      ContentType: req.file.mimetype, // File content type
      //ACL: "public-read", // File access control
    };

    // Upload the file to S3
    const uploadResult = await s3
      .upload(params)
      .promise()
      .catch((err) => {
        console.error("failed to upload resume to S3", err);
        return null;
      });

    if (!uploadResult) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Failed to upload resume to S3.",
      });
    }

    const dbCreateResult = await db.resumeFile
      .create({
        data: {
          fileName: req.file.originalname,
          uploadId,
          bucket: uploadResult.Bucket,
          key: uploadResult.Key,
        },
      })
      .catch((err) => {
        console.error("failed to save resume details to database", err);
        return null;
      });

    if (!dbCreateResult) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Failed to save resume details to database.",
      });
    }

    res.status(StatusCodes.CREATED).json({
      uploadId,
      message: "File uploaded successfully.",
    });
  }
);

// Define a GET route
resumeRouter.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

export { resumeRouter };
