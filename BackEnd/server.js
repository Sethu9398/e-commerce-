const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes=require('./routes/productRoutes');
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes=require('./routes/orderRoutes')


dotenv.config();          // 🔑 Load env variables FIRST
connectDB();              // 🔌 Connect to MongoDB

const app = express();



// 🔹 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // React frontend
    credentials: true
  })
);

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders",orderRoutes)


app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// 🔹 Test route
app.get("/", (req, res) => {
  res.send("<h1>Server is running</h1>");
});


// 🔹 Server start
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
