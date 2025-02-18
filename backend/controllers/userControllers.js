const User = require("../models/userModel");

const bcrypt = require("bcryptjs");
const generateToken = require('../utiles/tokens');


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
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser };