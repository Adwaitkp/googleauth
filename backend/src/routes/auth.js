const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function frontendBaseUrl() {
  return (process.env.FRONTEND_URL || "").replace(/\/$/, "");
}

function cookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };
}

function signJwt(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${frontendBaseUrl()}/?error=google_auth_failed`,
    session: false,
  }),
  (req, res) => {
    const token = signJwt(req.user);
    res.cookie("token", token, cookieOptions());
    return res.redirect(`${frontendBaseUrl()}/dashboard`);
  }
);

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.sub).select(
    "name email profilePicture createdAt"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user });
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token", cookieOptions());

  return res.status(200).json({ message: "Logged out" });
});

module.exports = router;
