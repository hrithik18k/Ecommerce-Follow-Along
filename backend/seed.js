const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/userModel');

dotenv.config();

const dummyUsers = [
    {
        name: 'Admin User',
        email: 'admin@luxemart.com',
        password: 'admin123',
        role: 'admin',
        profilePicture: '',
        addresses: [
            {
                country: 'India',
                city: 'Mumbai',
                address1: '123 Admin Street',
                address2: 'Suite 100',
                zipCode: '400001',
                addressType: 'Office'
            }
        ]
    },
    {
        name: 'Seller One',
        email: 'seller@luxemart.com',
        password: 'seller123',
        role: 'seller',
        profilePicture: '',
        addresses: [
            {
                country: 'India',
                city: 'Delhi',
                address1: '456 Seller Lane',
                address2: '',
                zipCode: '110001',
                addressType: 'Office'
            }
        ]
    },
    {
        name: 'Buyer One',
        email: 'buyer@luxemart.com',
        password: 'buyer123',
        role: 'buyer',
        profilePicture: '',
        addresses: [
            {
                country: 'India',
                city: 'Bangalore',
                address1: '789 Buyer Road',
                address2: 'Apt 5B',
                zipCode: '560001',
                addressType: 'Home'
            }
        ]
    }
];

async function seedUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        for (const userData of dummyUsers) {
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                console.log(`User ${userData.email} already exists, skipping...`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = new User({
                ...userData,
                password: hashedPassword
            });
            await user.save();
            console.log(`Created user: ${userData.email} (${userData.role})`);
        }

        console.log('\n--- Dummy Users Created ---');
        console.log('Admin:  admin@luxemart.com  /  admin123');
        console.log('Seller: seller@luxemart.com /  seller123');
        console.log('Buyer:  buyer@luxemart.com  /  buyer123');
        console.log('--------------------------\n');

        await mongoose.disconnect();
        console.log('Done!');
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
}

seedUsers();
