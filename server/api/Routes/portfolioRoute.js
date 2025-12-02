import authMiddleware from "../../middleware/authMiddleware.js";
import { addStock, updateQuantity, removeStock, portfolioSummary } from "../controllers/portfolioController.js";
import express from "express";



const router = express.Router();

router.post("/add",authMiddleware, addStock);
router.post("/updateQuantity", updateQuantity);
router.post("/removeStock", removeStock);
router.get("/all",authMiddleware, portfolioSummary);
router.post("/bulkadd",authMiddleware, addStock);

export default router;