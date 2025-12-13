const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const Sweet = require("../src/models/Sweet");
const jwt = require("jsonwebtoken");

describe("DELETE /api/sweets/:id", () => {
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

  it("should allow admin to delete sweet", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${testSweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    
    const deletedSweet = await Sweet.findById(testSweet._id);
    expect(deletedSweet).toBeNull();
  });

  it("should block non-admin user with 403", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${testSweet._id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    
    const sweet = await Sweet.findById(testSweet._id);
    expect(sweet).not.toBeNull();
  });

  it("should block unauthenticated access with 401", async () => {
    const res = await request(app).delete(`/api/sweets/${testSweet._id}`);

    expect(res.statusCode).toBe(401);
    
    const sweet = await Sweet.findById(testSweet._id);
    expect(sweet).not.toBeNull();
  });

  it("should return 404 for invalid id", async () => {
    const invalidId = "507f1f77bcf86cd799439011";
    const res = await request(app)
      .delete(`/api/sweets/${invalidId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });
});

