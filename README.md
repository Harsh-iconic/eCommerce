# ShopKart — MERN eCommerce

A full-stack shopping application built with MongoDB, Express, React and Node.js.

## Features
- Product catalogue with search, category filtering and price sorting
- Product detail pages and stock-aware shopping cart
- JWT-based registration and login
- Checkout with shipping address and order creation
- Customer order history
- Admin product creation and deletion
- Responsive storefront layout

## Project structure
- `backend/` — Express REST API, Mongoose models, authentication and order logic
- `frontend/` — React + Vite storefront

## Run locally

### Backend
1. `cd backend && npm install`
2. Create `.env` using the example below.
3. `npm run dev`

### Frontend
1. `cd frontend && npm install`
2. Optional: set `VITE_API_URL=http://localhost:5000/api` in `frontend/.env`
3. `npm run dev`

Backend environment:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shopkart
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

The first registered account is a regular customer. Admin access must be granted securely by changing the user's role directly in the database; public registration never accepts a role from the client.

## API overview
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/products` (supports `search`, `category`, `sort`, `page`, `limit`)
- `GET /api/products/:id`
- `POST /api/cart`, `GET /api/cart`, `PUT /api/cart/:productId`, `DELETE /api/cart/:productId`
- `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:orderId`

## Important
This project is a portfolio application. Configure production secrets, payment processing, email notifications, rate limiting, deployment origins and automated tests before accepting real customer payments or personal data.