const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser"); // Import cookie-parser

// Import routes
const productRoutes = require("./routes/productRoutrs");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config(); // Load environment variables from .env file

const app = express();

// CORS configuration
const corsOptions = {
    origin: ["https://ecommerce-follow-along-tau.vercel.app",
            "http://localhost:5173"
    ], 
    credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/api", productRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads")); // Serve static files for uploaded images
app.use("/api/orders", orderRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Root is working");
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Connect to MongoDB
main()
    .then(() => {
        console.log("Connected to DB Successfully");
    })
    .catch((err) => {
        console.error("Error connecting to DB:", err);
    });

    async function main() {
        await mongoose.connect("mongodb+srv://hrithikvasanthram:hrithik@cluster0.rrsug.mongodb.net/Ecommerce-Follow-Along");
    }