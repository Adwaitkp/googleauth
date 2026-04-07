const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const passport = require("passport");

dotenv.config();
require("./config/passport");

const authRoutes = require("./routes/auth");

const app = express();
const port = process.env.PORT || 5000;

function normalizeOrigin(origin) {
  return origin.replace(/\/$/, "");
}

const allowedOrigin = normalizeOrigin(process.env.FRONTEND_URL || "");

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (normalizeOrigin(origin) === allowedOrigin) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked for this origin"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.get("/api/health", (_req, res) => {
  res.json({ message: "Auth API is running" });
});

app.use("/api/auth", authRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
});

async function startServer() {
  const requiredEnv = [
    "MONGO_URI",
    "JWT_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
  ];

  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
