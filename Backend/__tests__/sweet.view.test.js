const request = require("supertest");
const app = require("../src/app");
const Sweet = require("../src/models/Sweet");

describe("GET /api/sweets", () => {
  beforeEach(async () => {
    await Sweet.deleteMany({});
  });
  it("should return 200 and an array", async () => {
    const res = await request(app).get("/api/sweets");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return empty array when database is empty", async () => {
    const res = await request(app).get("/api/sweets");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return sweets with required fields", async () => {
    const sweet = await Sweet.create({
      name: "Chocolate Bar",
      category: "Chocolate",
      price: 5.99,
      quantity: 10,
    });

    const res = await request(app).get("/api/sweets");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("name");
    expect(res.body[0]).toHaveProperty("category");
    expect(res.body[0]).toHaveProperty("price");
    expect(res.body[0]).toHaveProperty("quantity");
    expect(res.body[0].name).toBe("Chocolate Bar");
    expect(res.body[0].category).toBe("Chocolate");
    expect(res.body[0].price).toBe(5.99);
    expect(res.body[0].quantity).toBe(10);
  });

  it("should include image field if present", async () => {
    const sweet = await Sweet.create({
      name: "Candy",
      category: "Candy",
      price: 2.99,
      quantity: 20,
      imageUrl: "https://example.com/candy.jpg",
    });

    const res = await request(app).get("/api/sweets");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty("image");
    expect(res.body[0].image).toBe("https://example.com/candy.jpg");
  });

  it("should not include image field if not present", async () => {
    const sweet = await Sweet.create({
      name: "No Image Sweet",
      category: "Candy",
      price: 1.99,
      quantity: 15,
    });

    const res = await request(app).get("/api/sweets");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).not.toHaveProperty("image");
  });

  it("should return all sweets from database", async () => {
    await Sweet.create({
      name: "Sweet 1",
      category: "Category 1",
      price: 1.99,
      quantity: 5,
    });
    await Sweet.create({
      name: "Sweet 2",
      category: "Category 2",
      price: 2.99,
      quantity: 10,
    });

    const res = await request(app).get("/api/sweets");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("should not return extra fields", async () => {
    const sweet = await Sweet.create({
      name: "Test Sweet",
      category: "Test",
      price: 3.99,
      quantity: 8,
    });

    const res = await request(app).get("/api/sweets");

    expect(res.statusCode).toBe(200);
    const sweetResponse = res.body[0];
    const allowedFields = ["id", "name", "category", "price", "quantity", "image"];
    const responseFields = Object.keys(sweetResponse);
    const hasOnlyAllowedFields = responseFields.every((field) =>
      allowedFields.includes(field)
    );
    expect(hasOnlyAllowedFields).toBe(true);
  });
});

