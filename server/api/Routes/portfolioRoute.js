import authMiddleware from "../../middleware/authMiddleware.js";
import { addStock, updateQuantity, removeStock, portfolioSummary } from "../controllers/portfolioController.js";
import express from "express";
// import { getHoldingsCandlesHistoryAPI } from "../controllers/stockController.js";


const router = express.Router();

router.post("/add",authMiddleware, addStock);
router.post("/updateQuantity", updateQuantity);
router.delete("/removeStock/:id", authMiddleware,removeStock);
console.log("✅ DELETE /removeStock/:id registered");
router.get("/all",authMiddleware, portfolioSummary);
router.post("/bulkadd",authMiddleware, addStock);
// router.get("/holdingGraph",authMiddleware,getHoldingsCandlesHistoryAPI)

export default router;