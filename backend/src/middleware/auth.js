const jwt = require("jsonwebtoken");

function getTokenFromCookie(req) {
  return req.cookies?.token || null;
}

function requireAuth(req, res, next) {
  const token = getTokenFromCookie(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = {
  requireAuth,
};
