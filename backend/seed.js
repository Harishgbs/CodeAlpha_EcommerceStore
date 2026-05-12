const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');

const products = [
    { name: 'Laptop', price: 999, description: 'High-performance laptop with 16GB RAM and 512GB SSD', rating: 4.5, image: 'laptop.jpg', category: 'Electronics', stock: 25 },
    { name: 'Smartphone', price: 599, description: 'Latest smartphone with 128GB storage and 5G support', rating: 4.8, image: 'phone.jpg', category: 'Electronics', stock: 50 },
    { name: 'Headphones', price: 199, description: 'Wireless noise-cancelling headphones with 30hr battery', rating: 4.3, image: 'headphones.jpg', category: 'Electronics', stock: 100 },
    { name: 'Tablet', price: 449, description: 'Portable tablet with 10.9-inch Liquid Retina display', rating: 4.6, image: 'tablet.jpg', category: 'Electronics', stock: 30 },
    { name: 'Smartwatch', price: 299, description: 'Fitness tracker with heart rate monitor and GPS', rating: 4.2, image: 'watch.jpg', category: 'Wearables', stock: 75 },
    { name: 'Camera', price: 799, description: 'Professional DSLR camera with 24.2MP sensor', rating: 4.7, image: 'camera.jpg', category: 'Electronics', stock: 15 },
    { name: 'Wireless Mouse', price: 79, description: 'Ergonomic wireless mouse with fast scrolling', rating: 4.1, image: 'mouse.jpg', category: 'Accessories', stock: 200 },
    { name: 'Mechanical Keyboard', price: 149, description: 'RGB mechanical keyboard with Cherry MX switches', rating: 4.4, image: 'keyboard.jpg', category: 'Accessories', stock: 60 },
    { name: 'Monitor', price: 349, description: '27-inch 4K UHD monitor with HDR support', rating: 4.5, image: 'monitor.jpg', category: 'Electronics', stock: 20 },
    { name: 'Backpack', price: 89, description: 'Water-resistant laptop backpack with USB charging port', rating: 4.3, image: 'backpack.jpg', category: 'Accessories', stock: 120 },
    { name: 'Bluetooth Speaker', price: 129, description: 'Portable waterproof speaker with deep bass', rating: 4.0, image: 'speaker.jpg', category: 'Electronics', stock: 80 },
    { name: 'USB-C Hub', price: 45, description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader', rating: 4.2, image: 'hub.jpg', category: 'Accessories', stock: 150 },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected for seeding');

        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('Products seeded');

        const existingAdmin = await User.findOne({ email: 'admin@ecommerce.com' });
        if (!existingAdmin) {
            await User.create({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@ecommerce.com',
                password: 'admin123',
                isAdmin: true
            });
            console.log('Admin user created (admin@ecommerce.com / admin123)');
        }

        console.log('Seed complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
