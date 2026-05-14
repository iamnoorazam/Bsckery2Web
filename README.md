# BakeryCo - Full-Stack Online Bakery Platform

A modern online bakery platform with a React frontend and Node.js/Express backend. Customers can browse products, place orders, and leave reviews, while owners can manage their products and orders, and administrators can manage the entire platform.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Real-time Notifications](#real-time-notifications)
- [Screenshots](#screenshots)
- [License](#license)

## Overview

BakeryCo is a complete online bakery platform with three user roles:
- **Customers**: Browse products, add to cart, place orders, and leave reviews
- **Owners**: Manage their bakery products and orders, update order statuses
- **Admins**: Manage all users, categories, and platform settings

The platform features real-time order notifications, payment processing with Razorpay, and image uploads via Cloudinary.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Product Management**: CRUD operations for products with image uploads
- **Shopping Cart**: Add/remove items, update quantities, clear cart
- **Order Processing**: Place orders, track status (placed → accepted → preparing → out_for_delivery → delivered/cancelled)
- **Payment Integration**: Secure payments via Razorpay
- **Reviews & Ratings**: Customers can rate and review products
- **Real-time Notifications**: Socket.io for live order updates and notifications
- **Role-Based Access**: Admin, owner, and customer roles with specific permissions
- **Dashboard Analytics**: Owner and admin dashboards with key metrics

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs for authentication
- Cloudinary + Multer for image uploads
- Razorpay for payment processing
- Socket.io for real-time notifications
- Mocha/Chai for testing

### Frontend
- React 18 with Hooks
- Vite (fast build tool)
- Tailwind CSS + shadcn/ui components
- React Router for navigation
- Axios for API calls
- React Query for data fetching and caching
- Socket.io-client for real-time notifications
- Radix UI components for accessibility

## Project Structure

### Backend Structure

```
backend/
├── src/
│   ├── server.js             # Entry point
│   ├── app.js                # Express app setup
│   ├── config/
│   │   ├── db.js             # MongoDB connection
│   │   ├── cloudinary.js     # Cloudinary setup
│   │   └── razorpay.js       # Razorpay lazy init
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   ├── Payment.js
│   │   └── Notification.js
│   ├── repositories/         # Database queries only
│   │   ├── user.repository.js
│   │   ├── product.repository.js
│   │   ├── category.repository.js
│   │   ├── cart.repository.js
│   │   ├── order.repository.js
│   │   ├── review.repository.js
│   │   ├── payment.repository.js
│   │   └── notification.repository.js
│   ├── services/             # Business logic
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
│   ├── controllers/          # HTTP req/res handling
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
│   ├── routes/               # URL routing
│   │   ├── index.js          # Central router
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
│   ├── middleware/           # Middleware functions
│   │   ├── auth.middleware.js # JWT verification
│   │   ├── role.middleware.js # Role-based access
│   │   ├── upload.middleware.js # Cloudinary + Multer
│   │   └── error.middleware.js # Global error handler
│   └── utils/                # Shared utilities
│       ├── asyncHandler.js   # Wraps async controllers
│       ├── sendResponse.js   # Unified JSON response
│       └── generateToken.js  # JWT generator
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

### Frontend Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── api/                  # API service layer
│   │   ├── admin.api.js
│   │   ├── cart.api.js
│   │   ├── category.api.js
│   │   ├── notification.api.js
│   │   ├── order.api.js
│   │   ├── owner.api.js
│   │   ├── product.api.js
│   │   └── review.api.js
│   ├── components/
│   │   ├── atoms/            # UI primitives
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── StarRating.jsx
│   │   ├── molecules/        # Reusable components
│   │   │   ├── CartItem.jsx
│   │   │   ├── FormField.jsx
│   │   │   ├── OrderCard.jsx
│   │   │   ├── ReviewCard.jsx
│   │   │   └── StatCard.jsx
│   │   ├── organisms/        # Page-level components
│   │   │   ├── Footer.jsx
│   │   │   └── ProductGrid.jsx
│   │   └── ui/               # shadcn/ui components
│   │       ├── avatar.jsx
│   │       ├── badge.jsx
│   │       └── button.jsx
│   ├── store/
│   │   └── Toast.jsx         # Toast notification context
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # Application entry point
│   ├── index.css             # Global styles
│   └── routes/               # Routing configuration
├── index.html
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

## Installation

### Backend

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Configure environment**
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

3. **Run the server**
```bash
# Development
npm run dev

# Production
npm start
```

### Frontend

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Run the development server**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Configuration

The backend uses environment variables for configuration. The `.env.example` file contains all required variables with examples.

### Database
- The application connects to MongoDB using `MONGO_URI`
- Default collection names: users, products, categories, carts, orders, reviews, payments, notifications

### Authentication
- JWT secret is configured via `JWT_SECRET`
- JWT expires in 7 days by default (`JWT_EXPIRES_IN`)

### Cloudinary
- Required for image uploads
- Configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`

### Razorpay
- Payment processing
- Configure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

### Client URL
- `CLIENT_URL` should match your frontend URL (e.g., `http://localhost:3000` or your production domain)

## API Documentation

Base URL: `http://localhost:5000/api`

### Health Check
- `GET /health` - Returns API status

### Auth - `/api/auth`
- `POST /register` - Register a new user
- `POST /login` - Login and get token
- `POST /logout` - Logout
- `POST /forgot-password` - Request password reset token
- `POST /reset-password` - Reset password using token

### Products - `/api/products`
- `GET /` - Get all products (with filters)
- `GET /:id` - Get single product
- `POST /` - Create product (with images)
- `PUT /:id` - Update product
- `DELETE /:id` - Delete product

**Query params for GET `/`:** `?category=<categoryId>&search=cakes&page=1&limit=12`

### Categories - `/api/categories`
- `GET /` - Get all categories
- *Note: Categories are managed by admin via `/api/admin/categories`*

### Cart - `/api/cart`
- `GET /` - Get my cart
- `POST /add` - Add item to cart
- `DELETE /remove/:productId` - Remove item
- `PUT /quantity/:productId` - Update item quantity
- `DELETE /clear` - Clear entire cart

### Orders - `/api/orders`
- `POST /` - Place order from cart
- `GET /my` - My order history
- `PUT /:id/cancel` - Cancel a placed order
- `GET /:id` - Get order by ID
- `PUT /:id/status` - Update order status
- `GET /all` - Get all orders (admin only)

**Order status values:** `placed` → `accepted` → `preparing` → `out_for_delivery` → `delivered` / `cancelled`

### Payments - `/api/payments`
- `POST /create/:orderId` - Create Razorpay order
- `POST /verify` - Verify Razorpay payment

### Reviews - `/api/reviews`
- `GET /:productId` - Get product reviews
- `POST /:productId` - Add review
- `PUT /:id` - Edit own review
- `DELETE /:id` - Delete review

### Owner - `/api/owner`
- `GET /dashboard` - Dashboard stats
- `GET /orders` - My incoming orders
- `PUT /orders/:id/status` - Update order status
- `GET /products` - My product listings

### Admin - `/api/admin`
- `GET /stats` - Platform analytics
- `GET /users?role=owner` - List all users (filter by role)
- `PUT /users/:id/block` - Block or unblock a user
- `DELETE /users/:id` - Delete a user
- `PUT /users/:id/approve` - Approve a bakery owner
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Notifications - `/api/notifications`
- `GET /` - Get my notifications
- `PUT /read-all` - Mark all as read
- `DELETE /:id` - Delete a notification

### Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Response Format
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

## Real-time Notifications

The platform uses Socket.io for real-time order notifications.

**Client-side connection:**
```js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// Join your room with your userId
socket.emit("join_room", userId);

// Listen for order updates
socket.on("order_update", (data) => console.log(data));
```

**Events emitted by server:**
- `order_update`: Order status changed
- `new_order`: Owner receives a new order

## Screenshots

*(Note: Screenshot implementation would require actual screenshots from the application. Since this is a code-only project, no screenshots are provided here. Consider adding actual screenshots of the UI in production.)*

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.