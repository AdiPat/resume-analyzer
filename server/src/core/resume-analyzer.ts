import { s3 } from "../commons/config";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import pdf from "pdf-parse";
import { EventEmitter } from "events";
import { extractUploadIdFromS3Key } from "../commons";
import { db } from "./db";

type PresentationScore = {
  presentation: {
    score: number;
    description: string;
  };
};

class ResumeAnalyzer {
  private uploadId: string;
  private fileKey: string;
  private resumeText: string;
  private dataBuffer: Buffer | null;
  private model: any;
  private eventEmitter: EventEmitter;

  constructor(fileKey: string) {
    this.fileKey = fileKey; // format: resumes/{uploadId}_{fileName}
    this.uploadId = extractUploadIdFromS3Key(fileKey) ?? "";
    this.resumeText = "";
    this.dataBuffer = null;
    this.model = openai("gpt-4o");
    this.eventEmitter = new EventEmitter();

    this.eventEmitter.on("resume:analyze", this.handleAnalyzeEvent.bind(this));
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
        console.error("failed to fetch resume from s3", err);
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
    return this.resumeText;
  }

  async getPresentationScore(): Promise<PresentationScore> {
    const { text: score } = await generateText({
      model: this.model,
      prompt: `Determine a presentation score for the resume content between 1 to 5. 
              The presentation of the resume is how well-structured and easy to read it is. 
              Return only the number between 1 to 5.
              Resume Content: ${this.resumeText}`,
    });

    const { text: description } = await generateText({
      model: this.model,
      prompt: `Write a review on the presentation of the content in the resume. 
              The presentation of the resume is how well-structured and easy to read it is. 
              Return the response in plain-text in 3 paragraphs.
              Resume Content: ${this.resumeText}`,
    });

    return {
      presentation: {
        score: parseInt(score),
        description,
      },
    };
  }

  async getConcisenessScore() {
    const { text } = await generateText({
      model: this.model,
      prompt: `Determine a conciseness score for the resume content between 1 to 5. 
              The conciseness of the resume is how concise yet detailed the information is. 
              Return only the number between 1 to 5.
              Resume Content: ${this.resumeText}`,
    });

    const { text: description } = await generateText({
      model: this.model,
      prompt: `Write a review on the conciseness of the content in the resume. 
              The conciseness of the resume is how concise yet detailed the information is. 
               Return the response in plain-text in 3 paragraphs.
              Resume Content: ${this.resumeText}`,
    });

    return {
      conciseness: {
        score: parseInt(text),
        description,
      },
    };
  }

  async getLanguageAnalysis(): Promise<any> {
    const { text } = await generateText({
      model: this.model,
      prompt: `Analyze the resume for language and keywords and provide a score based on the relevance of the detected keywords to the job role. 
              The score should be a value between 1 and 5 (inclusive), indicating how well the resume matches the desired language and keyword criteria. 
              Additionally, list the detected keywords and provide a brief message summarizing the relevance of the keywords.
              The message is a 3-paragraph long review of the language and keywords used in the document.
              Return a JSON with the following structure: (score: number, keywords: string[], description: string)
              Resume Content: ${this.resumeText}`,
    });

    const resultJson = text
      .replace(/^```json\n|\n```$/g, "")
      .replace(/\r?\n|\r/g, "");

    const result = JSON.parse(resultJson);

    return {
      language_and_keywords: result,
    };
  }

  async getImpactScore(): Promise<any> {
    const { text } = await generateText({
      model: this.model,
      prompt: `Analyze the resume for impact and provide a score based on the impactfulness of the detected skills in the job role. 
              The score should be a value between 1 and 5 (inclusive), indicating how impactful each sentence in the resume is. 
              Additionally, list the detected skills.
              The message is a 3-paragraph long review of the impactfulness of the resume.
              Return a JSON with the following structure: (score: number, skills: string[], description: string)
              Resume Content: ${this.resumeText}`,
    });

    const resultJson = text
      .replace(/^```json\n|\n```$/g, "")
      .replace(/\r?\n|\r/g, "");

    const result = JSON.parse(resultJson);

    return {
      impact: result,
    };
  }

  async getRecommendedJobs(): Promise<string[]> {
    const { text } = await generateText({
      model: this.model,
      prompt: `Analyze the resume and recommend a job title based on the content. 
              Return the result as a JSON-array of strings containing the recommended job titles.
              Return 5 recommended job titles based on the resume content.
              Format Example: ["Software Engineer", "DevOps Engineer", "Technical Program Manager"]
              Resume Content: ${this.resumeText}`,
    });
    const resultJson = text
      .replace(/^```json\n|\n```$/g, "")
      .replace(/\r?\n|\r/g, "");

    const result = JSON.parse(resultJson);

    return result;
  }

  dispatchAnalysisEvent() {
    this.eventEmitter.emit("resume:analyze");
  }

  async handleAnalyzeEvent(): Promise<void> {
    console.log("analyzing resume: ", this.uploadId);

    await this.parseResume();

    const resumeAnalysis = await db.resumeAnalysis.findFirst({
      where: {
        uploadId: this.uploadId,
      },
    });

    if (resumeAnalysis) {
      return;
    }

    const presentation = await this.getPresentationScore().catch((err) => {
      console.error("failed to get presentation score", err);
      return {};
    });

    const conciseness = await this.getConcisenessScore().catch((err) => {
      console.error("failed to get conciseness score", err);
      return {};
    });

    const relevance = await this.getLanguageAnalysis().catch((err) => {
      console.error("failed to get language score", err);
      return {};
    });

    const impact = await this.getImpactScore().catch((err) => {
      console.error("failed to get impact score", err);
      return {};
    });

    const recommendedJobs = await this.getRecommendedJobs().catch((err) => {
      console.error("failed to get recommended job", err);
      return [];
    });

    await db.resumeAnalysis.create({
      data: {
        uploadId: this.uploadId,
        presentation: (presentation as any).presentation,
        conciseness: (conciseness as any).conciseness,
        relevance: relevance.language_and_keywords,
        recommendedJobs,
        impact: impact.impact,
      },
    });
  }

  async updateRecommendedJobs(): Promise<void> {
    const job = await db.resumeAnalysis.findFirst({
      where: {
        uploadId: this.uploadId,
      },
    });

    if (!job) {
      console.log(`resume analysis not found for uploadId=${this.uploadId}`);
      return;
    }

    if (!job.recommendedJobs || job.recommendedJobs.length === 0) {
      const recommendedJobs = await this.getRecommendedJobs().catch((err) => {
        console.error("failed to get recommended job", err);
        return [];
      });

      await db.resumeAnalysis.update({
        where: {
          id: job.id,
        },
        data: {
          recommendedJobs,
        },
      });
    }
  }
}

export { ResumeAnalyzer };
