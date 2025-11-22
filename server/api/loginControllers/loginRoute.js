import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


import user from "../../Schema/userSchema.js";
import { signupRoute } from "./signupRoute.js";
export async function loginRoute(req, res) {
    try {
        const { email, password, ...rest } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const existing = await user.findOne({ email });

        if (!existing) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, existing.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: existing._id }, "SECRET123", { expiresIn: "1d" });

        res.json({ message: "Login successful", token });

    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }

}