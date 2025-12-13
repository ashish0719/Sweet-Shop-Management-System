const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const jwt = require("jsonwebtoken");

describe("Admin middleware", () => {
  let userToken;
  let adminToken;

  beforeAll(async () => {
    await User.deleteMany({});

    const user = await User.create({
      name: "Normal User",
      email: "user@test.com",
      password: "password123",
      role: "user",
    });

    const admin = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: "password123",
      role: "admin",
    });

    userToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    adminToken = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET
    );
  });

  it("should block normal user from admin route", async () => {
    const res = await request(app)
      .get("/api/admin-test")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("should allow admin user to access admin route", async () => {
    const res = await request(app)
      .get("/api/admin-test")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });
});
