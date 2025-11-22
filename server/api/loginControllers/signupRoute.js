import bcrypt from "bcrypt";

import User from "../../Schema/userSchema.js";
export async function signupRoute(req, res) {
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