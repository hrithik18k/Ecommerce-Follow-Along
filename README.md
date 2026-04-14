# [LuxeMart](https://luxemart-ayw6.onrender.com/) — Premium E-Commerce Platform

> A full-stack marketplace with glassmorphism UI, role-based access, real-time notifications, Razorpay payments, and a seller analytics dashboard.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-luxemart--ayw6.onrender.com-818cf8?style=for-the-badge&logo=render&logoColor=white)](https://luxemart-ayw6.onrender.com/)
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat&logo=redux&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

---

## ✨ Features at a Glance

### 👤 Authentication & Roles
- JWT-based auth with bcrypt password hashing — 30-day token expiry
- Three role types: **Buyer**, **Seller**, **Admin** (only one admin allowed per platform)
- Profile management with avatar upload, editable email + name, address book (Home/Office/Other)

### 🛍️ Shopping Experience
- Product discovery with **category filter**, **price range filter**, and **4-way sort** (price, newest, top-rated)
- Live **search bar** with debounced autocomplete, image previews, and highlighted matches
- Full search results page with server-side pagination, sorting, and price filters
- **Product comparison** — select up to 3 products and compare price, stock, category, description side-by-side
- **Recently viewed products** persisted via localStorage on each product detail page
- Wishlist toggle per product, viewable from profile
- Multi-image product gallery with thumbnail selector

### 🛒 Cart & Checkout
- Add to cart with stock validation, quantity increase/decrease, item removal
- **Coupon system** — admin creates discount codes with expiry, usage limits, and enable/disable toggle
- Checkout flow: Cart → Select Address → Order Confirmation → Payment
- **Razorpay integration** for online payment with HMAC signature verification
- COD (Cash on Delivery) as alternative payment method

### 📦 Orders
- Buyer order history with a **4-step progress stepper** (Pending → Processing → Shipped → Delivered)
- Timestamped status history per step
- Order cancellation by buyer (creates notification)
- Seller order management with status update dropdown

### 📊 Seller Dashboard
- Revenue, order count, product count, average rating stats
- **CSS bar chart** of top-selling products (no chart library — pure CSS animations)
- Recent orders list with status badges
- Top products table with units sold and revenue generated per product

### 🔔 Notifications
- In-app notification bell with unread badge counter
- Auto-generated notifications on order status changes and cancellations
- Mark individual or all notifications as read; click to navigate to relevant page
- Polling every 60 seconds for fresh data

### 🔐 Admin Panel
- Platform-wide stats: users, products, orders, total revenue
- User role management table (promote/demote any user)
- Full coupon CRUD: create, list, enable/disable

### 🎨 UI/UX
- **Glassmorphism** design system with dark/light theme toggle (persisted to localStorage)
- CSS variable token system (`--color-accent`, `--surface`, `--border`, etc.)
- `Outfit` display font + `Inter` body font
- `fadeInUp`, `spin`, `growUp` keyframe animations throughout
- Responsive down to 480px — mobile-first cart and navbar

---

## 🏗️ Architecture

```
Browser
   │
   ├── React 18 + Vite (SWC)
   │   ├── Redux Toolkit (user auth, compare state)
   │   ├── React Router v7
   │   ├── Axios (API calls)
   │   └── react-hot-toast (notifications)
   │
   └── Express.js Backend
       ├── JWT + Bcrypt (auth)
       ├── Multer (image uploads → /uploads/)
       ├── Razorpay SDK (payments)
       ├── express-rate-limit (100 req/15min per IP)
       └── MongoDB + Mongoose ODM
```

---

## 📁 Project Structure

```
├── backend/
│   ├── controllers/
│   │   ├── userControllers.js      # Auth, profile, wishlist, admin stats
│   │   ├── productControllers.js   # CRUD, reviews, search + filter
│   │   ├── cartControllers.js      # Add, update quantity, remove
│   │   ├── orderControllers.js     # Place order, seller stats, status updates
│   │   ├── couponControllers.js    # Create, apply, toggle coupons
│   │   ├── notificationControllers.js
│   │   └── razorpayController.js   # Create order + verify HMAC signature
│   ├── models/                     # User, Product, Order, Coupon, Notification
│   ├── routes/                     # userRoutes, productRoutes, orderRoutes...
│   ├── middlewares/
│   │   ├── authMiddleware.js       # protect, adminOnly, sellerOrAdmin
│   │   └── multer.js               # diskStorage config
│   └── server.js                   # Express entry, MongoDB connect, CORS
│
├── frontend/
│   ├── src/
│   │   ├── components/             # 20+ feature components
│   │   ├── homepage/               # Home, Card, ProductForm
│   │   ├── store/
│   │   │   ├── userSlice.js        # email, role, token (persisted to localStorage)
│   │   │   ├── compareSlice.js     # Up to 3 products for comparison
│   │   │   └── store.js
│   │   ├── index.css               # Design tokens, CSS variables, animations
│   │   └── App.css                 # Component-level styles
│   └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+, npm
- MongoDB (Atlas or local)
- Razorpay account (test keys work)

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
PORT=3001
```

```bash
npm run dev   # nodemon
npm start     # production
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:
```env
VITE_BACKEND_URL=http://localhost:3001
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

```bash
npm run dev     # Vite dev server
npm run build   # Production build
```

---

## 🔑 API Overview

| Resource | Base Route | Auth Required |
|---|---|---|
| Users | `/api/users` | Mixed |
| Products | `/api` | Public GET, protected POST/PUT/DELETE |
| Orders | `/api/orders` | `protect` |
| Cart | `/api/users/cart` | `protect` |
| Coupons | `/api/coupons` | `protect` + `adminOnly` (create/list/toggle) |
| Notifications | `/api/notifications` | `protect` |

Key middleware: `protect` (validates JWT), `adminOnly`, `sellerOrAdmin`

---

## 💳 Payment Flow (Razorpay)

```
1. Frontend → POST /api/orders/create-order  (amount in paise)
2. Razorpay Checkout opens in browser
3. User pays → Razorpay calls handler with { razorpay_order_id, razorpay_payment_id, razorpay_signature }
4. Frontend → POST /api/orders/verify-payment  (HMAC SHA256 verification)
5. On success → POST /api/orders/place-order  (clears cart, decrements stock)
```

---

## 🗄️ Data Models (Key Fields)

**User** — name, email, password (hashed), role (buyer/seller/admin), profilePicture, addresses[], cart[], wishlist[]

**Product** — name, description, price, stock, category, imageUrl[], userEmail, reviews[], rating, numReviews

**Order** — user, products[], address, totalPrice, status, couponCode, discountAmount, statusHistory[]

**Coupon** — code (uppercase), discountPercent, maxUses, usedCount, expiresAt, isActive

**Notification** — user, title, message, isRead, link

---

## 🌐 Deployment

Deployed on **Render** (both frontend static site and backend web service).

CORS is configured to allow:
- `https://luxemart-ayw6.onrender.com`
- `https://luxemart-frontend-final.onrender.com`
- `http://localhost:5173` (local dev)

---

*React + Express + MongoDB · Razorpay · Redux Toolkit · Deployed on Render*
