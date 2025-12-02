import Holding from "../../Schema/HoldingsSchema.js";


export async function addStock(req, res) {
    try {

        const { symbol, ...rest } = req.body;

        console.log(req.body, "in addstock backend")

        if (!symbol) {
            return res.status(400).json({ message: "enter a valid stock tikcer/symbol" });
        }

        const existingsymbol = await Holding.findOne({ symbol });

        console.log(existingsymbol);

        if (existingsymbol) {
            return res.json({ message: "Stock is already added to your profile." });
        }

        const holding = new Holding({
            userId: req.user._id,
            symbol,
            ...rest
        });

        console.log(holding);

        await holding.save();

        res.status(201).json({ message: "Ticker addition successfull" });

    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }

}

export async function removeStock(req, res) {
    try {
        const { symbol } = req.body;

        if (!symbol) {
            return res.status(400).json({ message: "Stock symbol is required" });
        }

        const removed = await Holding.findOneAndDelete({ symbol });

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
        const user_id=req.user_id;
        const stocks=await Holding.find({user_id});
        console.log(stocks);

        res.json(stocks);
    }
    catch (e) {
        return res.status(500).json({ error: e.message })
    }

}