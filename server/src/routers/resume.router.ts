// usersRouter.ts
import { s3 } from "../commons/config";
import express from "express";
import multer from "multer";
import { nanoid } from "nanoid";
import { StatusCodes } from "http-status-codes";
import { db, ResumeAnalyzer } from "../core";

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

    const resumeAnalyzer = new ResumeAnalyzer(uploadResult.Key);

    resumeAnalyzer.dispatchAnalysisEvent();

    res.status(StatusCodes.CREATED).json({
      uploadId,
      message: "File uploaded successfully.",
    });
  }
);

resumeRouter.get("/analysis/:uploadId", async (req, res) => {
  const uploadId = req.params.uploadId;

  console.log({ eventId: "resume:analysis", uploadId });

  let resumeAnalysis = await db.resumeAnalysis.findFirst({
    where: {
      uploadId,
    },
  });

  if (!resumeAnalysis) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: "Resume analysis not found.",
    });
  }

  if (
    !resumeAnalysis.recommendedJobs ||
    resumeAnalysis.recommendedJobs.length === 0
  ) {
    const resume = await db.resumeFile.findFirst({
      where: {
        uploadId,
      },
    });

    if (!resume) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Resume not found.",
      });
    }

    const resumeAnalyzer = new ResumeAnalyzer(resume.key);
    await resumeAnalyzer.parseResume();
    await resumeAnalyzer.updateRecommendedJobs();
  }

  resumeAnalysis = await db.resumeAnalysis.findFirst({
    where: {
      uploadId,
    },
  });

  res.status(StatusCodes.OK).json(resumeAnalysis);
});

resumeRouter.get("/:uploadId/filename", async (req, res) => {
  const uploadId = req.params.uploadId;

  const resumeFile = await db.resumeFile.findFirst({
    where: {
      uploadId,
    },
  });

  if (!resumeFile) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: "Resume file not found.",
    });
  }

  res.status(StatusCodes.OK).json({
    fileName: resumeFile.fileName,
    uploadId,
  });
});

// Define a GET route
resumeRouter.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

export { resumeRouter };
