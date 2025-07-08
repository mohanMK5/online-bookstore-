const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 4011;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect('mongodb://localhost:27017/bookstore')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  cart: [{
    title: String,
    author: String,
    price: String,
    imgSrc: String
  }]
});

const User = mongoose.model("User", userSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/registration', (req, res) => {
  res.sendFile(path.join(__dirname, 'registration.html'));
});

app.get('/addtocart', (req, res) => {
  res.sendFile(path.join(__dirname, 'addtocart.html'));
});

app.post('/post', async (req, res) => {
  const { name, email, password, Cpsw } = req.body;

  if (password !== Cpsw) {
    return res.status(400).send("Passwords do not match");
  }

  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.send("Registration successful");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.post('/add-to-cart', async (req, res) => {
  const { userId, book } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart.push(book);
    await user.save();
    res.json({ message: "Book added to cart" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post('/buy-now', async (req, res) => {
  const { userId, book } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user || !book || !book.title) {
      return res.status(400).json({ message: "Invalid request" });
    }

    res.json({ message: "Book purchased successfully" });
  } catch (err) {
    res.status(500).json({ message: "Purchase failed" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
