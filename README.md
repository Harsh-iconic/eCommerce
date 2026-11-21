# ShopKart — MERN eCommerce

ShopKart is a full-stack shopping application built with MongoDB, Express, React and Node.js. It includes a responsive storefront, customer accounts, catalogue search, shopping cart, checkout, order management, wishlists and product reviews.

## Features

### Customer experience
- Responsive storefront with product search, category filters and price sorting
- Product detail pages with stock-aware quantity selection
- Customer registration and JWT authentication
- Persistent server-side shopping cart with quantity and stock validation
- Checkout with validated Indian delivery address and stock reservation
- Customer order history
- Personal wishlist with add/remove actions
- Product ratings and written reviews (one review per customer per product)

### Store administration
- Admin-only product creation, editing and deletion
- Admin order fulfilment dashboard
- Controlled order status transitions with inventory restoration on eligible cancellations
- Public registration cannot assign an admin role

### Reliability and security
- Password hashing and explicit password-field selection for login only
- Normalized unique email addresses
- Server-side product pricing at checkout
- Conditional stock reservation to reduce overselling
- Request validation, safe error responses and environment-secret checks
- Backend unit tests using Node's built-in test runner

## Project structure

- `backend/` — Express REST API, Mongoose models, middleware, controllers and tests
- `frontend/` — React + Vite customer storefront and admin screens

## Local setup

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env` using `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shopkart
JWT_SECRET=use_a_random_secret_at_least_32_characters_long
CLIENT_URL=http://localhost:5173
```

Start the API:

```bash
npm run dev
```

Run backend tests:

```bash
npm test
```

### 2. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Optional frontend environment variable in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## API overview

| Area | Endpoints |
|---|---|
| Authentication | `POST /api/auth/register`, `POST /api/auth/login` |
| Products | `GET /api/products`, `GET /api/products/:id` |
| Admin products | `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` |
| Cart | `GET /api/cart`, `POST /api/cart`, `PUT /api/cart/:productId`, `DELETE /api/cart/:productId` |
| Orders | `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:orderId` |
| Admin orders | `GET /api/orders/admin/all`, `PUT /api/orders/admin/:orderId/status` |
| Wishlist | `GET /api/wishlist`, `POST /api/wishlist`, `DELETE /api/wishlist/:productId` |
| Reviews | `GET /api/reviews/:productId`, `POST /api/reviews/:productId` |
| Health | `GET /api/health` |

Product listing supports `search`, `category`, `sort`, `page` and `limit` query parameters.

## Admin setup

Register a normal account first. To grant store-admin access for local development, update that account's `role` field to `admin` directly in MongoDB. Never expose an admin-role selector in public registration.

## Current limitations

- No live payment gateway is connected; checkout currently creates an order with a pending payment status.
- Email receipts, password reset, shipping-provider integration and automated browser/end-to-end tests are not included yet.
- Configure production database credentials, a strong JWT secret, exact CORS origins, HTTPS and deployment settings before using real customer data.
