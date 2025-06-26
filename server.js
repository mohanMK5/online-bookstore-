const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 4011;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB without deprecated options
mongoose.connect('mongodb://localhost:27017/bookstore')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB', err));

const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB connected");
});
db.on('error', (error) => {
    console.error("Database connection error:", error);
});

// Define schema for User and Cart
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cart: [
        {
            title: String,
            author: String,
            price: String,
            imgSrc: String
        }
    ]
});

const Users = mongoose.model("User", userSchema);

// Serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission for user registration
app.post('/post', async (req, res) => {
    try {
        const { name, email, password, Cpsw } = req.body;

        if (password !== Cpsw) {
            return res.status(400).send("Passwords do not match");
        }

        const user = new Users({ name, email, password });
        await user.save();
        console.log("User saved:", user);
        res.send("Form submission successful");
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send("Error saving user");
    }
});

app.post('/add-to-cart', async (req, res) => {
    try {
        const userId = req.body.userId; // Get the user ID
        const book = req.body.book; // Get the book details

        console.log('Received add-to-cart request:', { userId, book });

        // Find the user by ID and update the cart
        const user = await Users.findById(userId);

        if (!user) {
            console.log('User not found for add-to-cart:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        // Add the book to the user's cart (ensure it's unique)
        user.cart.push({
            title: book.title,
            author: book.author,
            price: book.price,
            imgSrc: book.imgSrc
        });

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'Book added to cart' });
    } catch (error) {
        console.error('Error in add-to-cart:', error);
        res.status(500).json({ message: 'Error adding book to cart' });
    }
});

app.post('/buy-now', async (req, res) => {
    try {
        const userId = req.body.userId; // Get the user ID
        const book = req.body.book; // Get the book details

        console.log('Received buy-now request:', { userId, book });

        // Find the user by ID
        const user = await Users.findById(userId);

        if (!user) {
            console.log('User not found for buy-now:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate book object
        if (!book || !book.title) {
            console.log('Invalid book data:', book);
            return res.status(400).json({ message: 'Invalid book data' });
        }

        // Do not save purchase info to user document as per user request

        console.log(`User ${userId} bought book:`, book);

        res.status(200).json({ message: 'Purchase successful' });
    } catch (error) {
        console.error('Error in buy-now:', error);
        res.status(500).json({ message: 'Error processing purchase' });
    }
});


// Serve the registration page
app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'registration.html'));
});

// Serve the add to cart page
app.get('/addtocart', (req, res) => {
    res.sendFile(path.join(__dirname, 'addtocart.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
