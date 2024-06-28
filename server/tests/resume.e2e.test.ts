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

describe("/resume/analysis", () => {
  it("responds with 404 NOT FOUND", async () => {
    await request(app).get("/analysis/123").expect(404);
  });

  it("responds with 200 OK", async () => {
    await request(app).get("/analysis/TuOPve").expect(200);
  });
});
