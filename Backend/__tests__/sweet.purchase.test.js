const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const Sweet = require("../src/models/Sweet");
const jwt = require("jsonwebtoken");

describe("POST /api/sweets/:id/purchase", () => {
  let userToken;
  let testSweet;

  beforeAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});

    const user = await User.create({
      name: "User",
      email: "user@sweet.com",
      password: "password123",
      role: "user",
    });

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

  it("should allow authenticated user to purchase sweet", async () => {
    const res = await request(app)
      .post(`/api/sweets/${testSweet._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(9);
  });

  it("should decrease quantity by 1", async () => {
    const initialQuantity = testSweet.quantity;

    const res = await request(app)
      .post(`/api/sweets/${testSweet._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(initialQuantity - 1);

    const updatedSweet = await Sweet.findById(testSweet._id);
    expect(updatedSweet.quantity).toBe(initialQuantity - 1);
  });

  it("should return 400 if stock is 0", async () => {
    testSweet.quantity = 0;
    await testSweet.save();

    const res = await request(app)
      .post(`/api/sweets/${testSweet._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(400);
    
    const sweet = await Sweet.findById(testSweet._id);
    expect(sweet.quantity).toBe(0);
  });

  it("should return 404 if sweet does not exist", async () => {
    const invalidId = "507f1f77bcf86cd799439011";
    const res = await request(app)
      .post(`/api/sweets/${invalidId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(404);
  });

  it("should return 401 if not authenticated", async () => {
    const res = await request(app).post(`/api/sweets/${testSweet._id}/purchase`);

    expect(res.statusCode).toBe(401);
    
    const sweet = await Sweet.findById(testSweet._id);
    expect(sweet.quantity).toBe(10);
  });
});



