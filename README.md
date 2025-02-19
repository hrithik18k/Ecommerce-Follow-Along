# E-Commerce-Application (WAR-MART)

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

## 🎯 Milestone 13

**Backend**: Already create a endpoint to update the product details.\
**Frontend**: Added Edit button on clicking the edit button it will redirect to a form with details filled automatically using location from `react-router-dom` made a put request to PUT `/api/products/:id` this endpoint.


## 🎯Milestone 14

**Backend**: Create a endpoint to Delete the product.\
**Frontend**: Added Delete button on clicking the delete button it will make a delete request to `/api/products/:id` which will delete the product from the database

## 🎯Milestone 15

**Navigation Bar**: Create a Navigation bar with home, add products,my products, cart and added necessary redirect Link\
**Responsive**: Created a Responsive navigation bar making hamburger style navbar for mobile devices.


## 🎯Milestone 16
**Frontend**: Develop a Product Details Page that displays relevant information when a user clicks on a product card.
Implement quantity selection with increment and decrement functionality, along with an "Add to Cart" button.

## 🎯Milestone 17

**Backend**: Created a Cart Schema to store the cart products and wrote necessary functions to add Products in cart, Delete products in cart and update the total price of the cart.

## 🎯Milestone 18

**Backend**: Create a endpoint  GET `/api/cart` to get all the products to display in the frontend\
**Backend**: Create a endpoint GET `/api/cart` to get all the products to display in the frontend\
**Frontend**: Displayed all the cart products by getting the product by id and displaying using the Cart cart created for Cart page

## 🎯Milestone 19

**Backend**: Create a endpoint to update the quantity of the product in the cart\
**Frontend**: Added a Increment and Decrement Button to Increase and Decrease the Quantity of the product and updated the total price of the cart.

## 🎯Milestone 20

**Backend**: Create a endpoint GET `api/auth` which will display the current logged user profile details.\
**Frontend**: Profile page created in the frontend which will show the user Details which contains the avatar, name, email, role and the address if address provided or else a text with "No Address Provided" with a Add Address Button.

## 🎯 Milestone 21

**Frontend**: In the Profile page, added add address button in the address section if address is not provided on clicking the button it will redirect to a address form which will contain city,address1, address2, zipcode.

## 🎯 Milestone 22

**Endpoint Creation**: Created a new endpoint in the user controller of POST `api/auth/add/address` it will add the address to the current logged in user.

##🎯 Milestone 23

**Frontend**: Added "Place Order" button in the cart page to navigate to the Select Address page and created Select Address page to display saved addresses and allow selection.\
**Backend**: Developed backend endpoint to fetch user addresses and wrote Mongoose schema to store order details.

## 🎯Milestone 24 

**Frontend:** Created **Order Confirmation** page and displayed ordered products, selected address, and total cart value.\
**Backend:**  API to fetch ordered products, total value, and selected address and handled order placement on button click.

## 🎯Milestone 25

**Endpoint Creation**: Create a Endpoint POST `api/order/place` to add the order with a unique order ID


## 🎯Milestone 26

### Frontend
- Built a **User Orders** page that showcases all past orders, including product details, order dates, and statuses.

### Backend
- Developed an API endpoint that takes a user's email, retrieves their **_id**, fetches all orders associated with that **_id**, and returns the order data.

---

## 🎯Milestone 27

### Frontend
- Designed a **My Orders** page to display all user orders with product details, order dates, and statuses.
- Added a **My Orders** link to the navbar for quick access.

### Backend
- Implemented the **My Orders** API to retrieve user orders based on their email and return the corresponding order details.

---

## 🎯Milestone 28

### Frontend
- Enhanced the **My Orders** page by introducing a **Cancel Order** button for active orders.
- The button remains hidden for already canceled orders.
- Clicking it updates the order status to **Canceled**.

### Backend
- Developed an endpoint (`/api/order/cancel/:id`) that:
  - Receives an **order ID**.
  - Locates the order.
  - Updates its status to **Canceled**.
  - Saves the modification.

---

## 🎯Milestone 29

### Frontend
- Integrated **Razorpay's** checkout system to streamline online payments.

### Backend
- Configured the **Razorpay API** to securely handle transactions via the endpoint `api/pay/checkout`.

## 🎯Milestone 30

### Frontend
- Updated the payment page by integrating **Razorpay’s checkout widget**.
- After creating a **Razorpay account** and obtaining **sandbox API keys**, installed the appropriate **NPM package** to display multiple online payment methods.

### Backend
- Created an endpoint (e.g., `/api/payment/razorpay`) that:
  - Uses **Razorpay’s API** along with the client key to initialize and process transactions.
  - Securely handles payment details.
  - Updates the **order status** upon successful payment.

