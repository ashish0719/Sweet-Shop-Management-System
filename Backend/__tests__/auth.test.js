const request = require("supertest");
const app = require("../src/app");

describe("POST /api/auth/register", () => {
  it("should return 201 and create a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "test@example.com");
  });
});
