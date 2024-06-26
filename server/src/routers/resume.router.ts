// usersRouter.ts
import "../commons/config";
import express from "express";
import multer from "multer";
import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import { StatusCodes } from "http-status-codes";

if (
  !(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION
  )
) {
  throw new Error("AWS credentials are not defined.");
}

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const resumeRouter = express.Router();

resumeRouter.post(
  "/upload",
  upload.single("file"),
  async (req: express.Request, res: express.Response) => {
    const resumeId = nanoid();

    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "No file uploaded.",
      });
    }

    const bucketName = process.env.AWS_BUCKET_NAME;

    if (!bucketName) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "AWS bucket name is not defined.",
      });
    }

    const params = {
      Bucket: bucketName, // The name of your S3 bucket
      Key: `resumes/${resumeId}_${req.file.originalname}`, // File name you want to save as
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
        message: "Failed to upload resume to S3.",
      });
    }

    res.status(StatusCodes.CREATED).json({
      resumeId: resumeId,
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
