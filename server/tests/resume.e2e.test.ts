import request from "supertest";
import { app } from "../src";

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
