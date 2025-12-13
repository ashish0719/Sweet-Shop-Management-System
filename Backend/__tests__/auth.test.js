const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

beforeEach(async () => {
  await User.deleteMany({});
});

describe("POST /api/auth/register", () => {
  it("should return 201 and create a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
  });

  it("should not return password in response", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "No Password",
      email: "nopassword@test.com",
      password: "secret123",
    });

    expect(res.body.user.password).toBeUndefined();
  });

  it("should store hashed password in database", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Hash User",
      email: "hash@test.com",
      password: "plainpassword",
    });

    const user = await User.findOne({ email: "hash@test.com" });

    expect(user.password).not.toBe("plainpassword");
    expect(user.password.length).toBeGreaterThan(20);
  });

  it("should not allow duplicate email registration", async () => {
    await request(app).post("/api/auth/register").send({
      name: "User One",
      email: "duplicate@test.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "User Two",
      email: "duplicate@test.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Email already registered");
  });

  it("should return 400 if name is missing", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if email is missing", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if password is missing", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
    });

    expect(res.statusCode).toBe(400);
  });
});
