import jwt from "jsonwebtoken";
// import User from "../models/User.js";
import User from "../Schema/userSchema.js";
export default async function authMiddleware(req, res, next) {
  try {
    // 1️⃣ Get token from header
    console.log("Auth middleware running");
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
     console.log("Token extracted:", token);

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, "SECRET123");
     console.log("Decoded token:", decoded);

    // 3️⃣ Find user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
            console.log("User not found for token");
      return res.status(401).json({ message: "Invalid token user" });
    }

    // 4️⃣ Attach user to request
    req.user = user;

    next(); // Allow request to continue
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error: error.message });
  }
}
