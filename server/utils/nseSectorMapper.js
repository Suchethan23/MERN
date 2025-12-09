import fs from "fs";

// Load files
const stocks = JSON.parse(fs.readFileSync("tokens.json", "utf8"));
const sectorMap = JSON.parse(fs.readFileSync("sector_mapped_list.json", "utf8"));

// Clean function to avoid name mismatches
const normalize = str =>
  str.toLowerCase().replace(/limited|ltd|,|\.|&/g, "").trim();

let final = [];

stocks.forEach(stock => {
  const nseName = normalize(stock["NAME OF COMPANY"]);

  const match = sectorMap.find(s => normalize(s.company) === nseName);

  final.push({
    symbol: stock.SYMBOL,
    name: stock["NAME OF COMPANY"],
    isin: stock["ISIN NUMBER"],
    sector: match?.sector || "Unknown",
    industry: match?.industry || "Unknown"
  });
});

// Save merged output
fs.writeFileSync("sector_stocks_final.json", JSON.stringify(final, null, 2));
console.log("Merged file created → sector_stocks_final.json");
