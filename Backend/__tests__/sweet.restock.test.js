const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const Sweet = require("../src/models/Sweet");
const jwt = require("jsonwebtoken");

describe("POST /api/sweets/:id/restock", () => {
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
  });

  beforeEach(async () => {
    await Sweet.deleteMany({});
    testSweet = await Sweet.create({
      name: "Chocolate Bar",
      category: "Chocolate",
      price: 5.99,
      quantity: 10,
    });
  });

  it("should allow admin to restock sweet", async () => {
    const res = await request(app)
      .post(`/api/sweets/${testSweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(15);
  });

  it("should increase quantity by provided amount", async () => {
    const initialQuantity = testSweet.quantity;
    const restockAmount = 10;

    const res = await request(app)
      .post(`/api/sweets/${testSweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: restockAmount });

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(initialQuantity + restockAmount);

    const updatedSweet = await Sweet.findById(testSweet._id);
    expect(updatedSweet.quantity).toBe(initialQuantity + restockAmount);
  });

  it("should block normal user with 403", async () => {
    const res = await request(app)
      .post(`/api/sweets/${testSweet._id}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(403);
    
    const sweet = await Sweet.findById(testSweet._id);
    expect(sweet.quantity).toBe(10);
  });

  it("should return 404 if sweet not found", async () => {
    const invalidId = "507f1f77bcf86cd799439011";
    const res = await request(app)
      .post(`/api/sweets/${invalidId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(404);
  });

  it("should return 400 if quantity is 0", async () => {
    const res = await request(app)
      .post(`/api/sweets/${testSweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 0 });

    expect(res.statusCode).toBe(400);
    
    const sweet = await Sweet.findById(testSweet._id);
    expect(sweet.quantity).toBe(10);
  });

  it("should return 400 if quantity is negative", async () => {
    const res = await request(app)
      .post(`/api/sweets/${testSweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: -5 });

    expect(res.statusCode).toBe(400);
    
    const sweet = await Sweet.findById(testSweet._id);
    expect(sweet.quantity).toBe(10);
  });

  it("should return 401 if unauthenticated", async () => {
    const res = await request(app)
      .post(`/api/sweets/${testSweet._id}/restock`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(401);
    
    const sweet = await Sweet.findById(testSweet._id);
    expect(sweet.quantity).toBe(10);
  });
});

