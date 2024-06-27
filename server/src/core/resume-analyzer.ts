import { s3 } from "../commons/config";
import pdf from "pdf-parse";


class ResumeAnalyzer {
  private fileKey: string;
  private resumeText: string;
  private dataBuffer: Buffer | null;

  constructor(fileKey: string) {
    this.fileKey = fileKey;
    this.resumeText = "";
    this.dataBuffer = null;
  }
  }

  async fetchResume(): Promise<void> {
    if (this.dataBuffer) {
      return;
    }

    this.dataBuffer = await s3
      .getObject({
        Bucket: process.env.AWS_BUCKET_NAME ?? "",
        Key: this.fileKey,
      })
      .promise()
      .then((data) => data.Body as Buffer)
      .catch((err) => {
        console.error("failed to fetch resume from s3");
        return null;
      });
  }

  async parseResume(): Promise<string> {
    if (!this.dataBuffer) {
      await this.fetchResume();
    }

    if (!this.dataBuffer) {
      throw new Error("Failed to fetch resume data.");
    }

    const data = await pdf(this.dataBuffer).catch((err) => {
      console.error("failed to parse resume", err);
      return null;
    });

    if (!data) {
      throw new Error("Failed to parse resume data.");
    }

    this.resumeText = data.text;

    return this.resumeText;
  }

  async getResumeText(): Promise<string> {
    console.log(this.resumeText);
    return this.resumeText;
  }

  async parseResume() {
    this.resumeText = "This is a sample resume text.";
    throw new Error("Method not implemented.");
  }

  async getPresentationScore() {
    return {
      presentation: {
        score: 0.8,
        message: "Your resume is well presented.",
      },
    };
  }

  async getConcisenessScore() {
    return {
      conciseness: {
        score: 0.6,
        message: "Your resume is concise.",
      },
    };
  }

  async getRelevanceScore() {
    return {
      relevance: {
        score: 0.9,
        message: "Your resume is relevant.",
      },
    };
  }

  async getKeywordsAnalysis() {
    return {
      keywords: {
        score: 0.7,
        message: "Your resume contains relevant keywords.",
        keywords_detected: ["Java", "Python", "JavaScript"],
      },
    };
  }

  getImpactScore() {
    return {
      impact: {
        score: 0.8,
        message: "Your resume is impactful.",
      },
    };
  }
}

export { ResumeAnalyzer };
