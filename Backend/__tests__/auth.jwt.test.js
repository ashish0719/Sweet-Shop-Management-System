const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("POST /api/auth/login (JWT)", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.create({
      name: "JWT User",
      email: "jwt@test.com",
      password: "password123",
      role: "user",
    });
  });

  it("should return a JWT token on successful login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "jwt@test.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });
});
