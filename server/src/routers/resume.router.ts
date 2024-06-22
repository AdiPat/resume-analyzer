// usersRouter.ts
import express from "express";
import multer from "multer";
import AWS from "aws-sdk";

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
  (req: express.Request, res: express.Response) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const bucketName = process.env.AWS_BUCKET_NAME;

    if (!bucketName) {
      return res.status(500).send("AWS bucket name is not defined.");
    }

    const params = {
      Bucket: bucketName, // The name of your S3 bucket
      Key: `resumes/${req.file.originalname}`, // File name you want to save as
      Body: req.file.buffer, // The file binary data
      ContentType: req.file.mimetype, // File content type
      //ACL: "public-read", // File access control
    };

    // Upload the file to S3
    s3.upload(params, (err: any, data: any) => {
      if (err) {
        console.error("Error uploading to S3:", err);
        return res.status(500).send("Failed to upload file.");
      }
      console.log("Successfully uploaded file to S3:", data);
      res.send({ message: "File uploaded successfully.", data });
    });
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
