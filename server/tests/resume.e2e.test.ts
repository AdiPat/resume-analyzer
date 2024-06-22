import request from "supertest";
import express from "express";
import { resumeRouter } from "../src/routers"; // Import your router

const app = express(); // Create an instance of your express app
app.use("/resume", resumeRouter); // Use your router

describe("GET /resume", () => {
  it("responds with json", async () => {
    const response = await request(app)
      .get("/resume")
      .expect("Content-Type", /json/)
      .expect(200);

    // Add more assertions here based on your requirements
    expect(response.body).toEqual({
      message: "Hello World!",
    });
  });
});
