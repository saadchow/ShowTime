const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Anime = require('./models/Anime');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected successfully to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));




app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      password: hashedPassword,
      watching: [],
      planToWatch: [],
      watched: [],
    });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

function auth(req, res, next) {
  const token = req.header('Authorization').split(' ')[1]; // Updated to handle 'Bearer {token}' format
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
}

app.get('/anime/:id', async (req, res) => {
    try {
        const anime = await Anime.findById(req.params.id);
        res.json(anime);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get('/check-auth', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, 'username');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


app.get('/watching', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.watching);
});

app.put('/watching/add', auth, async (req, res) => {
    try {
        const { animeId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.watching.includes(animeId)) {
            user.watching.push(animeId);
            await user.save();
        }

        res.json({ message: "Anime added to the watching list successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.put('/watching/remove', auth, async (req, res) => {
    try {
        const { animeId } = req.body;
        const user = await User.findById(req.user.id);

        user.watching = user.watching.filter(id => id !== animeId);
        await user.save();

        res.json({ message: "Anime removed from the watching list successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});


app.put('/planToWatch/add', auth, async (req, res) => {
    try {
        const { animeId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.planToWatch.includes(animeId)) {
            user.planToWatch.push(animeId);
            await user.save();
        }

        res.json({ message: "Anime added to the plan to watch list successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.put('/planToWatch/remove', auth, async (req, res) => {
    try {
        const { animeId } = req.body;
        const user = await User.findById(req.user.id);

        user.planToWatch = user.planToWatch.filter(id => id !== animeId);
        await user.save();

        res.json({ message: "Anime removed from the plan to watch list successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});


app.put('/watched/add', auth, async (req, res) => {
    try {
        const { animeId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.watched.includes(animeId)) {
            user.watched.push(animeId);
            await user.save();
        }

        res.json({ message: "Anime added to the watched list successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.put('/watched/remove', auth, async (req, res) => {
    try {
        const { animeId } = req.body;
        const user = await User.findById(req.user.id);

        user.watched = user.watched.filter(id => id !== animeId);
        await user.save();

        res.json({ message: "Anime removed from the watched list successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
