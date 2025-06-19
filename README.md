# ⭐ Ratings and Reviews System

A full-stack web application that allows users to rate and review products. Built using **Next.js** for the frontend, **Express.js (Node.js)** for the backend, and **PostgreSQL** for data persistence.

---

## 🚀 Features

- 📝 Users can submit **ratings**, **reviews**, or **both**
- ✅ Prevents multiple submissions from the same user for the same product
- 🧾 Displays summary ratings and reviews for each product
- 📷 Users can optionally **upload images** with their reviews


---

## 🧱 Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| Frontend    | Next.js (React)   |
| Backend     | Express.js (Node) |
| Database    | PostgreSQL        |
| Auth        | JWT / Sessions    |
| Image Upload| Cloudinary        |

---

## 📄 API Endpoints

### 🔹 Products

- `GET /products` — Get all products
- `GET /products/:id` — Get product details and reviews

### 🔹 Reviews

- `POST /reviews` — Submit a new review (rating/review/image)
- `GET /products/:id/reviews` — Get all reviews for a product

---

## 🧠 Database Schema

### 1. `users`

| Field      | Type        | Notes           |
|------------|-------------|-----------------|
| id         | SERIAL (PK) | Auto-generated  |
| name       | VARCHAR     | Required        |
| email      | VARCHAR     | Unique          |
| created_at | TIMESTAMP   | Default: now()  |

### 2. `products`

| Field       | Type        | Notes            |
|-------------|-------------|------------------|
| id          | SERIAL (PK) | Auto-generated   |
| name        | VARCHAR     | Required         |
| description | TEXT        | Optional         |
| price       | NUMERIC     | Required         |
| discount    | INTEGER     | % discount       |
| images      | TEXT[]      | Image URLs       |
| created_at  | TIMESTAMP   | Default: now()   |

### 3. `reviews`

| Field       | Type        | Notes                            |
|-------------|-------------|----------------------------------|
| id          | SERIAL (PK) | Auto-generated                   |
| user_id     | INT (FK)    | References `users(id)`           |
| product_id  | INT (FK)    | References `products(id)`        |
| rating      | INTEGER     | 1 to 5                           |
| review      | TEXT        | Optional                         |
| image       | TEXT        | Optional - uploaded image URL    |
| created_at  | TIMESTAMP   | Default: now()                   |

✅ **Constraint**: `user_id + product_id` must be unique (to prevent multiple reviews by same user on same product)

---

## 🛠️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/jais-ravi/fit-page_assignment.git
cd fit-page_assignment
```

### 2. Setup Backend 

```bash
cd server
npm install
# Create a .env file with DB connection
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
# Create .env.local with NEXT_PUBLIC_API_URL and CLOUDINARY details
npm run dev
```


## ✅ Input Validations

- All required fields are validated
- Rating must be between **1 to 5**
- Review text and image are optional
- Users **can’t rate the same product more than once**

---

## 🧠 Bonus Features

- ✅ Upload review images (stored via **Cloudinary**)

---

## 🧪 Testing

You can test the endpoints using **Postman** or your **frontend UI**.

- Ensure your **PostgreSQL database** is seeded with sample products
- Use **different users** to add reviews and verify constraint handling

