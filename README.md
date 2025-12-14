# 🍬 Sweet Shop Management System (TDD Kata)

A full-stack **Sweet Shop Management System** built using **Test-Driven Development (TDD)** principles.  
This project demonstrates backend API design, authentication, database integration, frontend SPA development, automated testing, clean coding practices, and **transparent AI-assisted development**.

---

## 📌 Project Overview

The Sweet Shop Management System allows users to browse, search, and purchase sweets, while administrators manage inventory and products securely.

The application follows a **production-ready architecture** with a strong focus on scalability, maintainability, and testability, closely reflecting real-world engineering practices.

---

## 🛠 Tech Stack

### Backend
- **Node.js + Express (TypeScript)**
- **MongoDB** (Mongoose ODM)
- **JWT Authentication**
- **Jest + Supertest** (TDD)
- **bcrypt** (Password hashing)

### Frontend
- **React**
- **Axios**
- **React Router**
- **Figma AI–assisted UI/UX**

### Tooling
- Git & GitHub
- Cursor IDE
- Postman
- ESLint & Prettier

---

## 🔐 Features

### Authentication & Authorization
- User registration & login
- JWT-based authentication
- Role-based access control (User / Admin)

### Sweets Management
- Add sweets (Admin only)
- View all sweets
- Search sweets by:
  - Name
  - Category
  - Price range
- Update sweet details (Admin only)
- Delete sweets (Admin only)

### Inventory Management
- Purchase sweets (quantity decreases)
- Restock sweets (Admin only)
- Purchase disabled when stock is zero

---

## 📂 API Endpoints

### Auth
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |

### Sweets (Protected)
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/sweets` | Add sweet (Admin) |
| GET | `/api/sweets` | List sweets |
| GET | `/api/sweets/search` | Search sweets |
| PUT | `/api/sweets/:id` | Update sweet |
| DELETE | `/api/sweets/:id` | Delete sweet (Admin) |

### Inventory (Protected)
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/sweets/:id/purchase` | Purchase sweet |
| POST | `/api/sweets/:id/restock` | Restock sweet (Admin) |

---

## 🧪 Test-Driven Development (TDD)

This project strictly follows **Red → Green → Refactor** methodology.

### Covered Scenarios
- User registration & login
- JWT authentication & authorization
- Admin-only access validation
- CRUD operations on sweets
- Purchase & restock logic
- Edge cases (out of stock, invalid inputs, unauthorized access)

### Run Tests
```bash
cd backend
npm test
