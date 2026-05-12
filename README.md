# E-Commerce Store

A full-stack e-commerce web application built with **HTML, CSS, JavaScript** on the frontend and **Express.js + MongoDB** on the backend.

## Features

### Frontend
- **Product Listings** — Browse, search, and sort products
- **Product Details** — View product info, ratings, and related items
- **Shopping Cart** — Add/remove items, update quantities, persisted in localStorage
- **Checkout** — Shipping info, payment form, order summary
- **User Authentication** — Register, login, session with JWT
- **User Account** — Profile info, order history
- **Admin Panel** — Single-page dashboard with stats, users, products CRUD, orders management, contact messages
- **Dark/Light Theme** — Persisted toggle with system preference detection
- **Scroll Animations** — IntersectionObserver-based reveal animations
- **Custom Toast Notifications** — Slide-in animated alerts replacing native alerts
- **Glassmorphism Navbar** — Backdrop-filter blur with theme-aware colors
- **Aurora Background** — Liquid blur animated gradient circles

### Backend (API)
- **Products API** — Public listing/detail, admin CRUD
- **Auth API** — Register, login, JWT-based session
- **Orders API** — Authenticated creation, user order history, admin full listing, status updates
- **Users API** — Admin list/delete
- **Contact API** — Submit contact messages
- **Admin Stats API** — Dashboard metrics (products, users, orders, revenue)

## Tech Stack

| Layer    | Technology                     |
|----------|--------------------------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend  | Node.js, Express.js            |
| Database | MongoDB (Mongoose ODM)         |
| Auth     | JWT (jsonwebtoken + bcryptjs)  |
| Other    | CORS, dotenv                   |

## Project Structure

```
EcommerceStore/
├── backend/
│   ├── middleware/
│   │   ├── auth.js          # JWT verification middleware
│   │   └── admin.js         # Admin role check middleware
│   ├── models/
│   │   ├── Product.js       # Product schema
│   │   ├── User.js          # User schema (bcrypt hashing)
│   │   └── Order.js         # Order schema
│   ├── routes/
│   │   ├── auth.js          # POST /register, /login, GET /me
│   │   ├── products.js      # CRUD /api/products
│   │   ├── orders.js        # POST /, GET /my, GET /all, PUT /:id/status
│   │   ├── users.js         # GET /, DELETE /:id
│   │   ├── contact.js       # POST /, GET /
│   │   └── admin.js         # GET /stats
│   ├── .env                 # Environment variables (MongoDB URI, JWT secret)
│   ├── .gitignore
│   ├── package.json
│   ├── seed.js              # Database seeder (12 products + admin user)
│   └── server.js            # Express app entry point
├── frontend/
│   ├── about.html
│   ├── account.html         # User profile & order history
│   ├── admin.html           # Admin dashboard (single-page)
│   ├── cart.html
│   ├── checkout.html
│   ├── contact.html
│   ├── index.html           # Homepage
│   ├── product-detail.html
│   ├── products.html        # Product grid with search & sort
│   ├── script.js            # Theme, cart, auth, toasts, scroll reveal
│   ├── signin.html
│   ├── signup.html
│   └── styles.css           # Full theme system & component styles
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas — a connection string is required)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Harishgbs/CodeAlpha_EcommerceStore.git
   cd CodeAlpha_EcommerceStore
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**  
   Edit `backend/.env` with your MongoDB URI:
   ```
   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ecommerce?appName=Cluster0
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```
   This creates 12 sample products and an admin user.

5. **Start the server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`.

6. **Open the frontend**  
   Open any `.html` file from `frontend/` in your browser, or serve them with VS Code Live Server.

## API Endpoints

| Method | Endpoint                  | Auth     | Description                |
|--------|---------------------------|----------|----------------------------|
| GET    | `/api/products`           | -        | List products (search/sort via query) |
| GET    | `/api/products/:id`       | -        | Get single product         |
| POST   | `/api/products`           | Admin    | Create product             |
| PUT    | `/api/products/:id`       | Admin    | Update product             |
| DELETE | `/api/products/:id`       | Admin    | Delete product             |
| POST   | `/api/auth/register`      | -        | Register new user          |
| POST   | `/api/auth/login`         | -        | Login, returns JWT token   |
| GET    | `/api/auth/me`            | User     | Get current user profile   |
| POST   | `/api/orders`             | User     | Place order                |
| GET    | `/api/orders/my`          | User     | Get user's orders          |
| GET    | `/api/orders/all`         | Admin    | Get all orders             |
| PUT    | `/api/orders/:id/status`  | Admin    | Update order status        |
| GET    | `/api/users`              | Admin    | List all users             |
| DELETE | `/api/users/:id`          | Admin    | Delete user                |
| POST   | `/api/contact`            | -        | Submit contact message     |
| GET    | `/api/contact`            | Admin    | List contact messages      |
| GET    | `/api/admin/stats`        | Admin    | Dashboard statistics       |

## Default Accounts

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@ecommerce.com    | admin123    |
| User    | john@example.com       | password123 |

Create additional users via the signup page.

## Screenshots

*(Add screenshots here)*
