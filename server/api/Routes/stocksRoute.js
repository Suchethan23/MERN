import authMiddleware from "../../middleware/authMiddleware.js";
import express from "express";
import { liveData } from "../controllers/stockController.js";


const router=express.Router();

router.get("/stock/:symbolToken", authMiddleware, liveData)

export default router;