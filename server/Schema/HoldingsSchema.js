import mongoose from "mongoose";

const holdingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  symbol: { type: String, required: true },      // Example: "TCS", "INFY"
  companyName: { type: String },
  sector: { type: String },                      // Auto-mapped later
  quantity: { type: Number, required: true },
  avgBuyPrice: { type: Number, required: true },
  buyDate: { type: Date },
  notes: { type: String },
  tags: [String],
}, { timestamps: true });

const Holding = mongoose.model("Holding", holdingSchema);
export default Holding;
