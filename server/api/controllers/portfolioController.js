import Holding from "../../Schema/HoldingsSchema.js";
import fs from "fs";

const stocks = JSON.parse(fs.readFileSync("utils/nse_final.json", "utf8"));

console.log(stocks);
function clean(str) {
    return str
        .toUpperCase()
        .replace(/limited|ltd|,|\.|&/gi, "")
        .replace(/\s+/g, " ") // collapse double spaces
        .trim();
}
export async function addStock(req, res) {
  try {
    let { symbol, isin, quantity, avgBuyPrice, ...rest } = req.body;

    if (!symbol && !isin)
      return res.status(400).json({ status:"failed", reason:"No symbol or ISIN provided" });

    symbol = symbol?.toUpperCase();
    // const clean = x => x?.replace(/ ltd| limited|\.|,/gi,"").trim().toUpperCase();

    let stockIsin = stocks.find(s => s.isin === isin) 

    if (!stockIsin) {
      return res.status(200).json({
        status:"failed",
        symbol,
        isin,
        reason:"No mapping found"
      });
    }

    const exists = await Holding.findOne({ symbol, userId:req.user._id });
    if (exists) {
      return res.status(200).json({
        status:"skipped",
        symbol,
        reason:"Already exists"
      });
    }

    const holding = new Holding({
      userId:req.user._id,
      symbol,
    //   isin: stockIsin.isin,
      quantity,
      avgBuyPrice,
      sector: stockIsin.sector || null,
      ...rest
    });

    await holding.save();
    return res.status(201).json({
      status: "success",
      symbol,
      isin: stockIsin.isin
    });

  } catch (err) {
    console.error("Error ->", err);
    res.status(500).json({ status:"error", reason: err.message });
  }
}


export async function removeStock(req, res) {
    try {
        console.log(req.params.symbol)

        const { id } = req.params;
        // console.log(await Holding.findOne({ symbol: req.params.symbol }))


        if (!id) {
            return res.status(400).json({ message: "Stock symbol is required" });
        }

        const removed = await Holding.findOneAndDelete({
            _id: id,
            userId: req.user._id
        });

        if (!removed) {
            return res.status(404).json({ message: "Stock not found in your holdings" });
        }

        return res.status(200).json({ message: "Stock removed successfully" });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

export async function updateQuantity(req, res) {
    try {
        const { symbol, quantity, type } = req.body;

        if (!symbol || !quantity || !type) {
            return res.status(400).json({
                message: "symbol, quantity, and type fields are required"
            });
        }

        const stock = await Holding.findOne({ symbol });

        if (!stock) {
            return res.status(404).json({ message: "Stock not found in your holdings" });
        }

        // Handle update types
        if (type === "add") {
            stock.quantity += quantity;
        }
        else if (type === "subtract") {
            if (stock.quantity < quantity) {
                return res.status(400).json({ message: "Cannot subtract more than available quantity" });
            }
            stock.quantity -= quantity;

            // Optional: If quantity becomes zero → delete the stock
            if (stock.quantity === 0) {
                await Holding.findOneAndDelete({ symbol });
                return res.status(200).json({ message: "Stock quantity became zero, stock removed" });
            }
        }
        else if (type === "set") {
            if (quantity < 0) {
                return res.status(400).json({ message: "Quantity cannot be negative" });
            }
            stock.quantity = quantity;
        }
        else {
            return res.status(400).json({ message: "Invalid type. Use add | subtract | set" });
        }

        await stock.save();

        return res.status(200).json({
            message: "Quantity updated successfully",
            updatedStock: stock
        });

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

export async function portfolioSummary(req, res) {
    try {
        const user_id = req.user_id;
        const stocks = await Holding.find({ user_id });
        // console.log(stocks);

        res.json(stocks);
    }
    catch (e) {
        return res.status(500).json({ error: e.message })
    }

}

// addStock();