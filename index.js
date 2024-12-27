const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 6001;
require("dotenv").config();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// MongoDB Schemas
const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    userName: String,
  },
  { collection: "users" } // Explicitly specify the collection name as 'users'
);

// MongoDB Models
const User = mongoose.model("User", userSchema);

// Routes

// 1. Signup API
app.post("/signup", async (req, res) => {
  const { email, password, userName } = req.body;
  console.log(email, password);
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists." });
  }

  const user = new User({ email, password, userName });
  await user.save();

  res.json({ message: "Signup successful." });
});

// 2. Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password." });
  }

  res.json({ message: "Login successful." });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running!`);
});
