import connectDB from "./config/db.js";

import express from "express";
import cors from "cors";
import User from "./Schema/userSchema.js";
import { loginRoute } from "./api/loginControllers/loginRoute.js";
import { signupRoute } from "./api/loginControllers/signupRoute.js";


connectDB();


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.post("/api/signup",signupRoute);
app.post("/api/login",loginRoute);

app.listen(5000, () => console.log("Server running on port 5000"));
