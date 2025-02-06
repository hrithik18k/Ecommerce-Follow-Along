const User = require("../models/userModel");

const bcrypt = require("bcryptjs");


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const profilePicture = req.file ? req.file.path : null;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User Already Exists");
            return res.status(400).json({ message: "User Already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profilePicture,
        });


        await newUser.save();
        res.status(201).json({ message: "New User registered successfully", user: newUser });

        
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
};

// Login function
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User Not found" });
        }
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        res.status(200).json({ message: "Login successful", token, user });
    } catch (err) {
        res.status(500).json({ message: "Error in logging", error: err.message });
    }
};

module.exports = { registerUser, loginUser };