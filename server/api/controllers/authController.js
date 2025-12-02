import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


import User from "../../Schema/userSchema.js";

export async function login(req, res) {
    try {
        const { email, password, ...rest } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const existing = await User.findOne({ email });

        if (!existing) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, existing.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: existing._id }, "SECRET123", { expiresIn: "1d" });

        res.status(200).json({ message: "Login successful", token });

    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }

}



export async function signup(req, res) {
    try {
      
        const {email, password,...rest}=req.body;
       // If email or password is missing
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.json({ message: "User exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with hashed password + remaining fields
        const user = new User({
            email,
            password: hashedPassword,
            ...rest,
        });
        await user.save();

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}