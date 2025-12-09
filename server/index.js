import connectDB from "./config/db.js";

import express from "express";
import cors from "cors";
import User from "./Schema/userSchema.js";


import authRoute from "./api/Routes/authRoute.js"
import  portfolioroute  from "./api/Routes/portfolioRoute.js";
import stocksRoute from "./api/Routes/stocksRoute.js"

connectDB();


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/auth",authRoute);
app.use("/api/portfolio",portfolioroute);
console.log("✅ Portfolio routes mounted at /api/portfolio");
app.use("/api/analytics", stocksRoute);


app.listen(5000, () => console.log("Server running on port 5000"));
