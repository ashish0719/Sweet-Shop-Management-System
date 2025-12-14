const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const Sweet = require("../src/models/Sweet");
const jwt = require("jsonwebtoken");

describe("PUT /api/sweets/:id", () => {
  let adminToken;
  let userToken;
  let testSweet;

  beforeAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});

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

    testSweet = await Sweet.create({
      name: "Chocolate Bar",
      category: "Chocolate",
      price: 5.99,
      quantity: 10,
    });
  });

  it("should allow admin to update sweet", async () => {
    const res = await request(app)
      .put(`/api/sweets/${testSweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Updated Chocolate Bar",
        category: "Chocolate",
        price: 6.99,
        quantity: 15,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Chocolate Bar");
    expect(res.body.price).toBe(6.99);
    expect(res.body.quantity).toBe(15);
  });

  it("should block non-admin user with 403", async () => {
    const res = await request(app)
      .put(`/api/sweets/${testSweet._id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Updated Name",
        category: "Chocolate",
        price: 7.99,
        quantity: 20,
      });

    expect(res.statusCode).toBe(403);
  });

  it("should block unauthenticated access with 401", async () => {
    const res = await request(app).put(`/api/sweets/${testSweet._id}`).send({
      name: "Updated Name",
      category: "Chocolate",
      price: 8.99,
      quantity: 25,
    });

    expect(res.statusCode).toBe(401);
  });

  it("should return 404 for invalid id", async () => {
    const invalidId = "507f1f77bcf86cd799439011";
    const res = await request(app)
      .put(`/api/sweets/${invalidId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Updated Name",
        category: "Chocolate",
        price: 9.99,
        quantity: 30,
      });

    expect(res.statusCode).toBe(404);
  });
});



