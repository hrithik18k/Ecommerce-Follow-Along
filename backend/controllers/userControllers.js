const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken'); 
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
        console.error("Error registering user:", err);
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log('Login request received:', email);

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const getUserProfile = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



const updateUserProfile = async (req, res) => {
    const { email } = req.params;
    const { name, addresses } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.addresses = addresses ? JSON.parse(addresses) : user.addresses;

        if (req.file) {
            user.profilePicture = req.file.path;
        }

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addAddress = async (req, res) => {
    const { email } = req.params;
    const { country, city, address1, address2, zipCode, addressType } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newAddress = {
            country,
            city,
            address1,
            address2,
            zipCode,
            addressType
        };

        user.addresses.push(newAddress);
        await user.save();

        res.status(200).json({ message: 'Address added successfully', addresses: user.addresses });
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteAddress = async (req, res) => {
    const { email } = req.params;
    const { index } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.addresses.splice(index, 1);
        await user.save();
        res.status(200).json({ message: 'Address deleted successfully', user });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, addAddress, deleteAddress };