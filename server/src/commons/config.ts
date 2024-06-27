import dotenv from "dotenv";
import AWS from "aws-sdk";

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env" });
} else {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
}

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

export { s3 };
