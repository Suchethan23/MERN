import authMiddleware from "../../middleware/authMiddleware.js";
import express from "express";
import { getCandlesAPI,  liveData } from "../controllers/stockController.js";
import { calculateSupertrend } from "../../Indicators/supertrend.js";
// import { getCandles } from "../controllers/historicalDataController.js";


const router=express.Router();

router.get("/stock/:symbolToken", authMiddleware, liveData,calculateSupertrend)
router.get("/candles/:isin",authMiddleware,getCandlesAPI)

export default router;