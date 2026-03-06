# [LuxeMart](https://luxemart-ayw6.onrender.com/) 

A premium, modern e-commerce application designed with a stunning glassmorphism aesthetic. LuxeMart provides a seamless shopping experience for buyers and a powerful management dashboard for sellers and admins.

## 🚀 Overview
LuxeMart is a full-stack e-commerce platform that allows users to browse high-end products, manage their shopping carts, and complete secure purchases. It features a robust role-based access system, ensuring that buyers, sellers, and admins each have tailored experiences.

## ✨ Key Features

### 👤 User Experience & Authentication
- **Secure Auth**: Full registration and login system with persistent sessions using JWT and hashed passwords (Bcrypt).
- **Profile Management**: Users can update their personal details, including profile pictures and email addresses, with real-time feedback.
- **Dynamic Themes**: Responsive dark and light modes with a single toggle.

### 🛍️ Shopping & Cart
- **Product Discovery**: Browse products with dynamic search and category-based filtering.
- **Premium UI**: Glassmorphism design system for a sleek, high-end feel.
- **Smart Cart**: Add/remove items and adjust quantities. The cart automatically clears upon successful order placement.

### 💼 Seller & Admin Dashboards
- **Product CRUD**: Sellers can add, edit, and delete their own products with multi-image upload support.
- **Order Management**: Dedicated dashboard for sellers to view incoming orders and update shipping/delivery statuses.
- **Admin Control**: Centralized management of users and platform-wide products.

### 💳 Payments & Orders
- **Secure Checkout**: Integrated with **Razorpay** for a seamless and secure transaction experience.
- **Order Tracking**: Buyers can track their order history and current status from their profile.

## 🛠️ Tech Stack

- **Frontend**: React.js, Redux Toolkit (State Management), Styled Components, Axios, React Router.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose ODM.
- **Security**: JWT (JSON Web Tokens), Bcrypt.js.
- **Payments**: Razorpay API.
- **Deployment**: Render.

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hrithik18k/Ecommerce-Follow-Along.git
   ```

2. **Backend Setup**:
   - Navigate to `/backend`
   - Install dependencies: `npm install`
   - Create a `.env` file and add:
     ```env
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     RAZORPAY_KEY_ID=your_key
     RAZORPAY_KEY_SECRET=your_secret
     ```
   - Start server: `npm start`

3. **Frontend Setup**:
   - Navigate to `/frontend`
   - Install dependencies: `npm install`
   - Create a `.env` file and add:
     ```env
     VITE_BACKEND_URL=http://localhost:3001
     VITE_RAZORPAY_KEY_ID=your_key
     ```
   - Start app: `npm run dev`

---
*Built with ❤️ for a modern shopping experience.*


