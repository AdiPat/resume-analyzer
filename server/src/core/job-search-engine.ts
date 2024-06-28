import { url } from "inspector";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

class JobSearchEngine {
  private query: string;
  private rawData: any;
  private model: any;

  constructor(query: string) {
    this.query = query;
    this.model = openai("gpt-4o");
  }

  async searchJobs(): Promise<any> {
    // Search for jobs based on the query
    const url = `https://s.jina.ai/ ${encodeURIComponent(this.query)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-With-Links-Summary": "true",
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .catch((err) => {
        console.error({
          eventId: "job-search:search-failure",
          message: "Failed to search for jobs",
          error: err,
        });
        return null;
      });

    if (!response) {
      return null;
    }

    this.rawData = response.data;

    return response.data;
  }

  private async getAllLinks(): Promise<{ title: string; url: string }[]> {
    if (!this.rawData) {
      await this.searchJobs();
    }

    if (!this.rawData) {
      console.log({
        eventId: "job-search:search-failure",
        message: "Failed to search for jobs",
      });
      return [];
    }

    const links: any[] = [];

    // Filter out invalid jobs
    this.rawData.forEach((entry: any) => {
      Object.entries(entry.links).forEach(([key, value]) => {
        links.push({
          title: key,
          url: value,
        });
      });
    });

    return links;
  }

  async isValidJobTitle(title: string): Promise<boolean> {
    const { text } = await generateText({
      model: this.model,
      prompt: `Determine if the job title "${title}" can be classified as a valid job title. Return "true" or "false".`,
    });

    return text === "true";
  }

  async getValidJobs(): Promise<{ title: string; url: string }[]> {
    const links = await this.getAllLinks();
    const validLinks = [];

    for (let i = 0; i < links.length; i++) {
      const isValid = await this.isValidJobTitle(links[i].title);
      if (isValid) {
        validLinks.push(links[i]);
      }
    }

    return validLinks;
  }

  updateQuery(query: string): void {
    if (!query) {
      throw new Error("Query cannot be empty");
    }

    this.query = query;
  }
}

export { JobSearchEngine };
