# Bakery Backend API

A clean, production-ready REST API for a full-stack bakery platform built with Node.js, Express, MongoDB, and Socket.io.

---

## Architecture

```
Route → Controller → Service → Repository → Model
```

| Layer | Folder | Responsibility |
|---|---|---|
| Routes | `src/routes/` | URL mapping + middleware attachment |
| Controllers | `src/controllers/` | Parse req/res, delegate to service |
| Services | `src/services/` | All business logic |
| Repositories | `src/repositories/` | All database queries |
| Models | `src/models/` | Mongoose schemas |
| Middleware | `src/middleware/` | Auth, roles, upload, error handling |
| Utils | `src/utils/` | Shared helpers |
| Config | `src/config/` | DB, Cloudinary, Razorpay setup |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server |
| MongoDB + Mongoose | Database |
| JWT + bcryptjs | Auth & password hashing |
| Cloudinary + Multer | Image upload |
| Razorpay | Payment processing |
| Socket.io | Real-time notifications |

---

## Project Structure

```
backend/
├── src/
│   ├── server.js                  # Entry point
│   ├── app.js                     # Express app setup
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   ├── cloudinary.js          # Cloudinary setup
│   │   └── razorpay.js            # Razorpay lazy init
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   ├── Payment.js
│   │   └── Notification.js
│   ├── repositories/              # DB queries only
│   │   ├── user.repository.js
│   │   ├── product.repository.js
│   │   ├── category.repository.js
│   │   ├── cart.repository.js
│   │   ├── order.repository.js
│   │   ├── review.repository.js
│   │   ├── payment.repository.js
│   │   └── notification.repository.js
│   ├── services/                  # Business logic
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   ├── category.service.js
│   │   ├── cart.service.js
│   │   ├── order.service.js
│   │   ├── payment.service.js
│   │   ├── review.service.js
│   │   ├── admin.service.js
│   │   ├── owner.service.js
│   │   ├── notification.service.js
│   │   └── socket.service.js
│   ├── controllers/               # HTTP req/res
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   ├── payment.controller.js
│   │   ├── review.controller.js
│   │   ├── admin.controller.js
│   │   ├── owner.controller.js
│   │   └── notification.controller.js
│   ├── routes/
│   │   ├── index.js               # Central router
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── category.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   ├── payment.routes.js
│   │   ├── review.routes.js
│   │   ├── admin.routes.js
│   │   ├── owner.routes.js
│   │   └── notification.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT verification
│   │   ├── role.middleware.js     # Role-based access
│   │   ├── upload.middleware.js   # Cloudinary + Multer
│   │   └── error.middleware.js    # Global error handler
│   └── utils/
│       ├── asyncHandler.js        # Wraps async controllers
│       ├── sendResponse.js        # Unified JSON response
│       └── generateToken.js      # JWT generator
├── .env.example
├── .gitignore
└── package.json
```

---

## Setup

**1. Install dependencies**
```bash
npm install
```

**2. Configure environment**
```bash
cp .env.example .env
```

Fill in your `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bakery
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**3. Run the server**
```bash
# Development
npm run dev

# Production
npm start
```

---

## Roles

| Role | Description |
|---|---|
| `admin` | Full platform control |
| `owner` | Manages their bakery products and orders |
| `customer` | Browses, orders, reviews products |

---

## API Reference

Base URL: `http://localhost:5000/api`

Health Check: `GET /health`

---

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register a new user |
| POST | `/login` | No | Login and get token |
| POST | `/logout` | Yes | Logout |
| POST | `/forgot-password` | No | Request password reset token |
| POST | `/reset-password` | No | Reset password using token |

**Register body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"
}
```

**Login body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Login response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": "...", "name": "John", "email": "...", "role": "customer" }
  }
}
```

---

### Products — `/api/products`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/` | No | All | Get all products (with filters) |
| GET | `/:id` | No | All | Get single product |
| POST | `/` | Yes | owner, admin | Create product (with images) |
| PUT | `/:id` | Yes | owner, admin | Update product |
| DELETE | `/:id` | Yes | owner, admin | Delete product |

**Query params for GET `/`:**
```
?category=<categoryId>&search=cakes&page=1&limit=12
```

**Create Product** — `multipart/form-data`:
```
name, description, price, category, stock, images[] (up to 5 files)
```

---

### Categories — `/api/categories`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/` | No | All | Get all categories |

> Categories are managed by admin via `/api/admin/categories`.

---

### Cart — `/api/cart`

> All cart routes require `customer` role.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get my cart |
| POST | `/add` | Add item to cart |
| DELETE | `/remove/:productId` | Remove item |
| PUT | `/quantity/:productId` | Update item quantity |
| DELETE | `/clear` | Clear entire cart |

**Add to cart body:**
```json
{
  "productId": "64f...",
  "quantity": 2
}
```

**Update quantity body:**
```json
{ "quantity": 3 }
```

---

### Orders — `/api/orders`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/` | Yes | customer | Place order from cart |
| GET | `/my` | Yes | customer | My order history |
| PUT | `/:id/cancel` | Yes | customer | Cancel a placed order |
| GET | `/:id` | Yes | Any | Get order by ID |
| PUT | `/:id/status` | Yes | owner, admin | Update order status |
| GET | `/all` | Yes | admin | Get all orders |

**Place order body:**
```json
{
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "online"
}
```

**Order status values:** `placed` → `accepted` → `preparing` → `out_for_delivery` → `delivered` / `cancelled`

**Update status body:**
```json
{ "status": "accepted" }
```

---

### Payments — `/api/payments`

> Requires `customer` role.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/create/:orderId` | Create Razorpay order |
| POST | `/verify` | Verify Razorpay payment |

**Verify payment body:**
```json
{
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "sig_xxx",
  "orderId": "64f..."
}
```

---

### Reviews — `/api/reviews`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/:productId` | No | All | Get product reviews |
| POST | `/:productId` | Yes | customer | Add review |
| PUT | `/:id` | Yes | owner (review) | Edit own review |
| DELETE | `/:id` | Yes | Any | Delete review |

**Add review body:**
```json
{
  "rating": 5,
  "comment": "Amazing cakes!"
}
```

---

### Owner — `/api/owner`

> All routes require `owner` role.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Dashboard stats |
| GET | `/orders` | My incoming orders |
| PUT | `/orders/:id/status` | Update order status |
| GET | `/products` | My product listings |

**Dashboard response:**
```json
{
  "totalOrders": 42,
  "todayOrders": 5,
  "totalProducts": 12,
  "totalRevenue": 15000
}
```

---

### Admin — `/api/admin`

> All routes require `admin` role.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats` | Platform analytics |
| GET | `/users?role=owner` | List all users (filter by role) |
| PUT | `/users/:id/block` | Block or unblock a user |
| DELETE | `/users/:id` | Delete a user |
| PUT | `/users/:id/approve` | Approve a bakery owner |
| POST | `/categories` | Create category |
| PUT | `/categories/:id` | Update category |
| DELETE | `/categories/:id` | Delete category |

**Block/unblock body:**
```json
{ "isBlocked": true }
```

**Create category body:**
```json
{
  "name": "Cakes",
  "description": "All types of cakes",
  "image": "optional_url"
}
```

---

### Notifications — `/api/notifications`

> All routes require authentication.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get my notifications |
| PUT | `/read-all` | Mark all as read |
| DELETE | `/:id` | Delete a notification |

---

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Response Format

All responses follow this structure:

**Success:**
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Real-Time (Socket.io)

Connect to the server and join your user room to receive live notifications.

```js
// Client side
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// Join your room with your userId
socket.emit("join_room", userId);

// Listen for order updates
socket.on("order_update", (data) => console.log(data));
```

**Events emitted by server:**
| Event | Trigger |
|---|---|
| `order_update` | Order status changed |
| `new_order` | Owner receives a new order |

---

## Database Collections

| Collection | Model |
|---|---|
| `users` | User |
| `products` | Product |
| `categories` | Category |
| `carts` | Cart |
| `orders` | Order |
| `reviews` | Review |
| `payments` | Payment |
| `notifications` | Notification |

---

## Error Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (wrong role / blocked) |
| 404 | Resource not found |
| 500 | Internal server error |
