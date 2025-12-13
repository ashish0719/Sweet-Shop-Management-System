const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const jwt = require("jsonwebtoken");

describe("Auth middleware", () => {
  let token;

  beforeEach(async () => {
    await User.deleteMany({});

    const user = await User.create({
      name: "Protected User",
      email: "protected@test.com",
      password: "password123",
      role: "user",
    });

    token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );
  });

  it("should allow access with valid token", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Access granted");
  });

  it("should block access without token", async () => {
    const res = await request(app).get("/api/protected");
    expect(res.statusCode).toBe(401);
  });

  it("should block access with invalid token", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.statusCode).toBe(401);
  });
});
