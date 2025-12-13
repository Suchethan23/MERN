import connectDB from "./config/db.js";

import express from "express";
import cors from "cors";
import User from "./Schema/userSchema.js";


import authRoute from "./api/Routes/authRoute.js"
import  portfolioroute  from "./api/Routes/portfolioRoute.js";
import stocksRoute from "./api/Routes/stocksRoute.js"
import { calculateSupertrend } from "./Indicators/supertrend.js";
import { computeRSI } from "./Indicators/rsi.js";
import { supertrendBacktest } from "./Backtest/superTrendBackTest_return.js";
import { dailySuperTrendChecker } from "./DailyChecks/dailySuperTrendChecker.js";
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
//  const data = await supertrendBacktest(); // ✅ now waits for SmartAPI login & candles
//   console.log("📈 rsi Response:", data.reverse());

const data=await calculateSupertrend()
console.log("data", data);

