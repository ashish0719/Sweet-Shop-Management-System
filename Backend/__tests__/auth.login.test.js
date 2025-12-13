const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.create({
      name: "Test User",
      email: "login@test.com",
      password: "password123",
    });
  });

  it("should login with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@test.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("login@test.com");
  });

  it("should return 401 for wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@test.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
  });

  it("should return 404 if user does not exist", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nouser@test.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(404);
  });

  it("should return 400 if email is missing", async () => {
    const res = await request(app).post("/api/auth/login").send({
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if password is missing", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@test.com",
    });

    expect(res.statusCode).toBe(400);
  });
});
