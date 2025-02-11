# E-Commerce-Application

## Overview
An E-Commerce application that allows users to browse products, add them to a shopping cart, and complete purchases. The app includes features for user authentication, product management, and order tracking.

## Features
1. *User Authentication*:
   - Registration and login system.
   - Password encryption for secure accounts.

2. *Product Management*:
   - Product listing with details (name, description, price, image, category).
   - Search and filter functionality.

3. *Shopping Cart*:
   - Add, update, or remove items from the cart.
   - View total price dynamically.

4. *Checkout and Payment*:
   - Order summary before purchase.
   - Integration with payment gateways (e.g., Stripe, PayPal).

5. *Admin Dashboard*:
   - Manage products (add, update, delete).
   - View and manage orders.
   - View user activity.

6. *Order Management*:
   - Track order status (pending, shipped, delivered).
   - View order history.

## Tech Stack
- *Frontend*:
  - React.js 
  - HTML and CSS

- *Backend*:
  - Node.js with Express.js
  - RESTful API development

- *Database*:
  - MongoDB

- *Authentication*:
  - JWT (JSON Web Tokens) for secure login sessions

- *Payment Gateway*:
  - Stripe or PayPal integration

- *Deployment*:
  - Hosting:Vercel
  - Version control: Git/GitHub


---
## 🎯Milestone 1
Create a new repository and integrated with vs-code
added a Readme.md about the project
This is basically a ecommerce project where user can make purchases

## 🎯Milestone 2 

By completing this milestone, we have achieved the following objectives:

1. **Project Setup:**
   - Initialized the project using React with the command:  
     ```bash
     npx create-react-app frontend
     ```
   - Created a structured folder hierarchy with separate `frontend` and `backend` directories.

2. **Login Page Development:**
   - Designed and implemented a functional login page.
   - Used React state to handle form inputs.
   - Implemented form submission logic to send user data to a backend endpoint.
   - Added simple inline styling without using external libraries.

3. **React Components Structure:**
   - Created a `Login.jsx` component inside `src/components/`.
   - Rendered the login page inside `App.js` for display.

---

## 🛠️ Technologies Used

- **Frontend:** React.js
- **Styling:** Inline CSS
- **State Management:** React useState Hook
- **Backend Endpoint (Placeholder):** `http://localhost:5000/login`

---

## 📄 Features Implemented

- **User Input Handling:**  
  Users can enter their email and password.
  
- **Form Validation:**  
  Basic HTML validation for required fields.

- **Backend Request:**  
  The form submits user credentials to the backend using the `fetch` API.

## 🎯Milestone 3: Project Setup for Backend
- Set up a structured folder hierarchy for backend code (routes, controllers, models, etc.).
- Initialized a Node.js and Express server.
- Connected the backend to MongoDB for efficient data storage.
- Implemented basic error handling for the server.


## 🎯Milestone 4: User Model, Controller & File Uploads

### Features Implemented:
- Created a `User` model using Mongoose.
- Developed a `UserController` to handle user registration.
- Integrated `Multer` for profile picture uploads.
- Set up `/register` API endpoint to allow users to sign up with a profile picture.

### How to Test:
1. Start the server: `node server.js`
2. Use **Postman** or **cURL** to send a `POST` request to `/api/users/register` with:
   - `name`
   - `email`
   - `password`
   - Profile picture as a file

The uploaded profile pictures will be stored in the `/uploads/` folder.


## 🎯Milestone 5: Sign-Up Page
SignUp Implementation: Created a Basic Sign up page using react and made a post request using axios to the backend Styling: Styled the Signup.jsx using Basic Css with the help of styled components

## 🎯Milestone 6 & 7

Encryption: The password is securely hashed using bcryptjs in userController.js before being stored in the database.

Decryption: When a user attempts to log in, the entered password is verified against the stored hash using bcrypt's compare function to check for a match.

## 🎯Milestone 8: Product Card Component

### Features Implemented:
- Created a reusable `card` component to display product details.
- Designed the homepage layout to display multiple product cards using a grid layout.


## 🎯Milestone 9: Product Form
- Created a form to input product details and upload multiple images.
- Implemented form submission logic to handle input data and images.
- Added a route to display the product form in the application.

## 🎯Milestone 10: 
- Schema Creation: Created a Structured Product Schema with necessary fields and data types \n Endpoint Creation: Created Enought endpoints to make operation with the Product data \n Endpoints:

- POST /api/addProducts GET /api/addProducts GET /api/addProducts/:id PUT /api/addProducts/:id DELETE /api/addProducts/:id


## 🎯Milestone 11: Dynamic Home Page
- In this milestone, we made the home page dynamic by fetching product data from MongoDB and displaying it using the product card component.

#### Backend
- Added an endpoint to fetch all products from MongoDB.
- Updated `productControllers.js` and `productRoutrs.js` to include the new endpoint.

#### Frontend
- Updated `homepage/app.jsx` to fetch product data from the backend.
- Displayed the fetched data dynamically using the product card component.

## 🎯 Milestone 12 :
- Backend: Developed an API endpoint in Node.js with Express to query and retrieve products from MongoDB, filtering them based on the authenticated user's email.
- Frontend: Implemented a function to fetch the filtered product data and dynamically render it using the existing product card component.
