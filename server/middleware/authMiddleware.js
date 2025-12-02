import jwt from "jsonwebtoken";
// import User from "../models/User.js";
import User from "../Schema/userSchema.js";
export default async function authMiddleware(req, res, next) {
  try {
    // 1️⃣ Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, "SECRET123");

    // 3️⃣ Find user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid token user" });
    }

    // 4️⃣ Attach user to request
    req.user = user;

    next(); // Allow request to continue
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error: error.message });
  }
}
