import { createRequire } from "module";
const require = createRequire(import.meta.url);
const tokens = require("./nse_final.json");

function clean(str) {
  return str
    .toLowerCase()
    .replace(/limited|ltd|,|\.|&/gi, "")
    .replace(/\s+/g, " ") // collapse double spaces
    .trim();
}

export const getSymbolTokens = (isin) => {
  if (!isin) return { NSE: null, matched: null, isin: null };

  const stock = tokens.find(t => t.isin === isin);

  return stock
    ? { NSE: stock.token, matched: stock.symbol, isin: stock.isin ,stockName:stock.name}
    : { NSE: null, matched: null, isin };
};

