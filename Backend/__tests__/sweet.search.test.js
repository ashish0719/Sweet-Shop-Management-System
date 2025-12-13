const request = require("supertest");
const app = require("../src/app");
const Sweet = require("../src/models/Sweet");

describe("GET /api/sweets/search", () => {
  beforeEach(async () => {
    await Sweet.deleteMany({});
  });

  beforeEach(async () => {
    await Sweet.create({
      name: "Chocolate Bar",
      category: "Chocolate",
      price: 5.99,
      quantity: 10,
    });
    await Sweet.create({
      name: "Dark Chocolate",
      category: "Chocolate",
      price: 7.99,
      quantity: 15,
    });
    await Sweet.create({
      name: "Vanilla Candy",
      category: "Candy",
      price: 2.99,
      quantity: 20,
    });
    await Sweet.create({
      name: "Gummy Bears",
      category: "Candy",
      price: 3.99,
      quantity: 25,
    });
    await Sweet.create({
      name: "Milk Chocolate",
      category: "Chocolate",
      price: 4.99,
      quantity: 12,
    });
  });

  it("should search by name (partial match, case-insensitive)", async () => {
    const res = await request(app).get("/api/sweets/search?name=chocolate");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((sweet) => {
      expect(sweet.name.toLowerCase()).toContain("chocolate");
    });
  });

  it("should search by name with different case", async () => {
    const res = await request(app).get("/api/sweets/search?name=CHOCOLATE");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((sweet) => {
      expect(sweet.name.toLowerCase()).toContain("chocolate");
    });
  });

  it("should search by category", async () => {
    const res = await request(app).get("/api/sweets/search?category=Candy");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    res.body.forEach((sweet) => {
      expect(sweet.category).toBe("Candy");
    });
  });

  it("should search by minPrice", async () => {
    const res = await request(app).get("/api/sweets/search?minPrice=5");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((sweet) => {
      expect(sweet.price).toBeGreaterThanOrEqual(5);
    });
  });

  it("should search by maxPrice", async () => {
    const res = await request(app).get("/api/sweets/search?maxPrice=4");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((sweet) => {
      expect(sweet.price).toBeLessThanOrEqual(4);
    });
  });

  it("should search by price range", async () => {
    const res = await request(app).get("/api/sweets/search?minPrice=3&maxPrice=5");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((sweet) => {
      expect(sweet.price).toBeGreaterThanOrEqual(3);
      expect(sweet.price).toBeLessThanOrEqual(5);
    });
  });

  it("should return empty array when no matches found", async () => {
    const res = await request(app).get("/api/sweets/search?name=NonExistent");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should combine name and category filters", async () => {
    const res = await request(app).get("/api/sweets/search?name=chocolate&category=Chocolate");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((sweet) => {
      expect(sweet.name.toLowerCase()).toContain("chocolate");
      expect(sweet.category).toBe("Chocolate");
    });
  });

  it("should combine name and price range filters", async () => {
    const res = await request(app).get("/api/sweets/search?name=chocolate&minPrice=5&maxPrice=8");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((sweet) => {
      expect(sweet.name.toLowerCase()).toContain("chocolate");
      expect(sweet.price).toBeGreaterThanOrEqual(5);
      expect(sweet.price).toBeLessThanOrEqual(8);
    });
  });

  it("should combine category and price range filters", async () => {
    const res = await request(app).get("/api/sweets/search?category=Candy&minPrice=3&maxPrice=4");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].category).toBe("Candy");
    expect(res.body[0].price).toBeGreaterThanOrEqual(3);
    expect(res.body[0].price).toBeLessThanOrEqual(4);
  });

  it("should combine all filters", async () => {
    const res = await request(app).get("/api/sweets/search?name=chocolate&category=Chocolate&minPrice=5&maxPrice=8");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((sweet) => {
      expect(sweet.name.toLowerCase()).toContain("chocolate");
      expect(sweet.category).toBe("Chocolate");
      expect(sweet.price).toBeGreaterThanOrEqual(5);
      expect(sweet.price).toBeLessThanOrEqual(8);
    });
  });

  it("should return all sweets when no filters provided", async () => {
    const res = await request(app).get("/api/sweets/search");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(5);
  });
});

