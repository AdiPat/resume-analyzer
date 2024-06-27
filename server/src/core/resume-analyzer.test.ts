import { ResumeAnalyzer } from "./resume-analyzer";

const SAMPLE_RESUME_KEY = "resumes/4Jfd7Jnb98GJtCiW4Hzoo_ADITYA_RESUME.pdf";

jest.setTimeout(30000);

describe("resume-analyzer", () => {
  it("should parse a resume correctly", async () => {
    // s3://resume-analyzer-0001/resumes/4Jfd7Jnb98GJtCiW4Hzoo_ADITYA_RESUME.pdf
    const resumeAnalyzer = new ResumeAnalyzer(SAMPLE_RESUME_KEY);
    await resumeAnalyzer.parseResume();
    const resumeText = await resumeAnalyzer.getResumeText();
    expect(resumeText.includes("Tech Lead")).toBeTruthy();
  });

  it("should have a presentation score", async () => {
    const resumeAnalyzer = new ResumeAnalyzer(SAMPLE_RESUME_KEY);
    await resumeAnalyzer.parseResume();
    const presentationScore = await resumeAnalyzer.getPresentationScore();
    console.log({ presentationScore });
    expect(presentationScore).toHaveProperty("presentation");
    expect(presentationScore.presentation).toHaveProperty("score");
    expect(presentationScore.presentation).toHaveProperty("description");
  });
  it("should have a language and keywords score, description and ", async () => {
    const resumeAnalyzer = new ResumeAnalyzer(SAMPLE_RESUME_KEY);
    await resumeAnalyzer.parseResume();
    const languageScore = await resumeAnalyzer.getLanguageAnalysis();
    expect(languageScore).toHaveProperty("language_and_keywords");
    expect(languageScore.language_and_keywords).toHaveProperty("score");
    expect(languageScore.language_and_keywords).toHaveProperty("description");
    expect(languageScore.language_and_keywords).toHaveProperty("keywords");
  });
});
