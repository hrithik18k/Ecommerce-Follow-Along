const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Product = require('./models/productModels');

dotenv.config();

const categories = [
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Books',
    'Toys & Games'
];

const productPrefixes = ['Premium', 'Classic', 'Modern', 'Eco-friendly', 'High-quality', 'Luxurious', 'Compact', 'Durable'];
const productTypes = {
    'Electronics': ['Smartphone', 'Laptop', 'Headphones', 'Smartwatch', 'Tablet', 'Camera', 'Speaker'],
    'Fashion': ['T-shirt', 'Jeans', 'Jacket', 'Shoes', 'Dress', 'Sunglasses', 'Watch'],
    'Home & Kitchen': ['Blender', 'Coffee Maker', 'Toaster', 'Knife Set', 'Pan', 'Air Purifier', 'Vacuum'],
    'Beauty & Personal Care': ['Moisturizer', 'Shampoo', 'Lipstick', 'Perfume', 'Face Wash', 'Sunscreen'],
    'Sports & Outdoors': ['Running Shoes', 'Yoga Mat', 'Backpack', 'Tent', 'Dumbbells', 'Water Bottle'],
    'Books': ['Novel', 'Biography', 'Cookbook', 'Self-help Book', 'History Book', 'Sci-fi Novel'],
    'Toys & Games': ['Board Game', 'Action Figure', 'Puzzle', 'Building Blocks', 'Remote Control Car']
};

const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'Chris', 'Sarah', 'David', 'Laura', 'Robert', 'Emma'];
const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez'];

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // 1. Create Admin if not exists
        const adminEmail = 'admin@luxemart.com';
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = new User({
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                addresses: [{ country: 'India', city: 'Mumbai', address1: '123 Admin St', zipCode: '400001', addressType: 'Office' }]
            });
            await admin.save();
            console.log('Admin created');
        } else {
            console.log('Admin already exists');
        }

        // 2. Add 20 Mixer Users
        console.log('Seeding 20 mixer users...');
        const sellers = [];
        for (let i = 0; i < 20; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const name = `${firstName} ${lastName}`;
            const email = `user${i + 1}_${Date.now()}@example.com`;
            const role = Math.random() > 0.7 ? 'seller' : 'buyer';
            const hashedPassword = await bcrypt.hash('password123', 10);

            const user = new User({
                name,
                email,
                password: hashedPassword,
                role,
                addresses: [{ country: 'India', city: 'City' + i, address1: 'Street ' + i, zipCode: '10000' + i, addressType: 'Home' }]
            });
            await user.save();
            if (role === 'seller') sellers.push(email);
        }
        console.log('20 users created');

        // Ensure we have at least one seller for products
        if (sellers.length === 0) {
            const sellerEmail = 'seller@luxemart.com';
            const existingSeller = await User.findOne({ email: sellerEmail });
            if (!existingSeller) {
                const hashedPassword = await bcrypt.hash('seller123', 10);
                const seller = new User({ name: 'Default Seller', email: sellerEmail, password: hashedPassword, role: 'seller' });
                await seller.save();
                sellers.push(sellerEmail);
            } else {
                sellers.push(sellerEmail);
            }
        }

        // 3. Add 150 Products
        console.log('Seeding 150 products...');
        const products = [];
        for (let i = 0; i < 150; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const typeList = productTypes[category];
            const type = typeList[Math.floor(Math.random() * typeList.length)];
            const prefix = productPrefixes[Math.floor(Math.random() * productPrefixes.length)];

            const name = `${prefix} ${type} ${i + 1}`;
            const description = `This is a ${prefix.toLowerCase()} ${type.toLowerCase()} from our ${category.toLowerCase()} collection. High quality and durable.`;
            const price = Math.floor(Math.random() * 900) + 100;
            const stock = Math.floor(Math.random() * 50) + 10;
            const sellerEmail = sellers[Math.floor(Math.random() * sellers.length)];

            // Using placeholder images
            const imageUrl = [`https://picsum.photos/seed/${i + 100}/400/400`];

            products.push({
                name,
                description,
                price,
                stock,
                category,
                imageUrl,
                userEmail: sellerEmail
            });
        }
        await Product.insertMany(products);
        console.log('150 products created');

        await mongoose.disconnect();
        console.log('Seeding complete!');
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedData();
