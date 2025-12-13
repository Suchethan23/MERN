import Holding from "../../Schema/HoldingsSchema.js";

import { getSymbolTokens } from "../../utils/getSymbolTokens.js";
import { getSmartApiSession } from "../../utils/angleone.js";
import fs from "fs";

const stocks = JSON.parse(fs.readFileSync("utils/nse_final.json", "utf8"));

// console.log(stocks);
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
            return res.status(400).json({ status: "failed", reason: "No symbol or ISIN provided" });

        symbol = symbol?.toUpperCase();
        // const clean = x => x?.replace(/ ltd| limited|\.|,/gi,"").trim().toUpperCase();
        let stockIsin;
        if (!isin) {
            stockIsin = stocks.find(s =>

                s.symbol === symbol

            )
            console.log(stockIsin,"in line 33 single addstock")
        }
        else {

            stockIsin = stocks.find(s =>

                s.isin === isin
            )
        }
        console.log(stockIsin, "in line 28 portfolio controller")
        console.log(isin, "in line 28 portfolio controller");
        console.log(!stockIsin)
        if (!stockIsin) {
            return res.status(200).json({
                status: "failed",
                symbol,
                isin,
                reason: "No mapping found"
            });
        }

        const exists = await Holding.findOne({ symbol, userId: req.user._id });
        if (exists) {
            return res.status(200).json({
                status: "skipped",
                symbol,
                reason: "Already exists"
            });
        }

        const holding = new Holding({
            userId: req.user._id,
            symbol,
            isin: stockIsin.isin,
            industry:stockIsin.industry,
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
        res.status(500).json({ status: "error", reason: err.message });
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

// export async function portfolioSummary(req, res) {
//     try {
//         const user_id = req.user_id;
//         const stocks = await Holding.find({ user_id });
//         // console.log(stocks);

//         res.json(stocks);
//     }
//     catch (e) {
//         return res.status(500).json({ error: e.message })
//     }

// }

export async function portfolioSummary(req, res) {
    try {
        const userId = req.user.id;
        // assuming token auth

        // 1. Fetch holdings saved in DB
        const holdings = await Holding.find({ userId });   // array of holding objects

        // console.log(holdings, "in line 173 portfolio controller")

        if (!holdings.length)
            return res.json({ ok: true, holdings: [] });

        // 2. Convert symbols → tokens
        const tokensList = holdings
            .map(h => getSymbolTokens(h.isin)?.NSE)
            .filter(Boolean);

        // console.log(tokensList, "in line 183 in portfoliocontroller")
        const api = await getSmartApiSession();

        // 3. Fetch live market data in single call
        const marketData = await api.marketData({
            mode: "FULL",
            exchangeTokens: { NSE: tokensList }
        });

        // console.log(JSON.stringify(marketData, 2),"market data")

        // 4. Merge holdings + Live LTP
        const merged = holdings.map(hold => {
            // find price data for this stock
            // console.log(hold)
            const tokenObj = getSymbolTokens(hold.isin);
            // console.log(tokenObj,"in line 203 in portfolio controller");

            // console.log(tokenObj.NSE, "in line 205 portfolio controller");

            // console.log(marketData.data.fetched)
            const live = marketData.data.fetched.find(i => {
                // console.log(i.symbolToken,a, tokenObj?.NSE); 
                //  a++;
                return i.symbolToken === tokenObj.NSE
            });


            console.log(live,  "in line 206 in portfolio controller");

            return {
                symbol: hold.symbol,
                quantity: hold.quantity,
                avgBuyPrice: hold.avgBuyPrice,
                isin: hold.isin,
                sector: hold.sector,
                industry:hold.industry,
                token: tokenObj?.NSE,
                ltp: live?.ltp,
                percentChange:live?.percentChange,
                currentValue: hold.quantity * live?.ltp,
                profitLoss: (live?.ltp - hold.avgBuyPrice) * hold.quantity
            };
        });

        return res.json({ ok: true, count: merged.length, portfolio: merged });

    } catch (e) {
        console.log("❌ERROR:", e.message);
        return res.status(500).json({ error: "Failed to fetch portfolio" });
    }
}

// addStock();