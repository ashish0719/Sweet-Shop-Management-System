const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const jwt = require("jsonwebtoken");

describe("POST /api/sweets (admin)", () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    await User.deleteMany({});

    const admin = await User.create({
      name: "Admin",
      email: "admin@sweet.com",
      password: "password123",
      role: "admin",
    });

    const user = await User.create({
      name: "User",
      email: "user@sweet.com",
      password: "password123",
      role: "user",
    });

    adminToken = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET
    );

    userToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );
  });

  it("should allow admin to add a sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Gulab Jamun",
        category: "Indian",
        price: 10,
        quantity: 50,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Gulab Jamun");
  });

  it("should block normal user from adding sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Rasgulla",
        category: "Indian",
        price: 8,
        quantity: 30,
      });

    expect(res.statusCode).toBe(403);
  });

  it("should block unauthenticated access", async () => {
    const res = await request(app).post("/api/sweets").send({
      name: "Barfi",
      category: "Indian",
      price: 12,
      quantity: 20,
    });

    expect(res.statusCode).toBe(401);
  });
});
