// import { getSmartApiSession } from "../../utils/angleone.js";

// export async function liveData(req,res) {
//   try{
//     const { symbolToken } = req.params;

//     const api = await getSmartApiSession();
    
//     const ltpData = await api.ltpData(
//       "NSE",
//       req.query.symbol || "RELIANCE", // fallback symbol if not provided
//       symbolToken
//     );

//     return res.json({
//       token: symbolToken,
//       ltp: ltpData.data.ltp,
//       full: ltpData
//     });

//   } catch(e){
//     console.log("❌ ERROR:", e);
//     return res.status(500).json({ error: e.message });
//   }
// }


import { getSmartApiSession } from "../../utils/angleone.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const tokens = require("../../utils/tokens.json");

// console.log(tokens);


function getSymbolTokens(symbol) {
  symbol = symbol.toLowerCase().trim();

  const nse = tokens.find(t =>
    (t.symbol.toLowerCase().includes(symbol) ||
     t.name.toLowerCase().includes(symbol)) &&
     t.exch_seg === "NSE"
  );

  const bse = tokens.find(t =>
    (t.symbol.toLowerCase().includes(symbol) ||
     t.name.toLowerCase().includes(symbol)) &&
     t.exch_seg === "BSE"
  );

  return { NSE: nse?.token || null, BSE: bse?.token || null };
}

export async function liveData(req,res) {
  try {
    const { symbolToken } = req.params;
//    console.log(req.params,symbol, "in  live data req.params")

  

//    const result = findToken(symbolToken)

//    console.log(result, "in stockController");

    const api = await getSmartApiSession();   // login session
    console.log("🟢 Logged in — Fetching LTP...");


    
const tokensFound = getSymbolTokens(symbolToken);

if (!tokensFound.NSE && !tokensFound.BSE) {
  return res.status(404).json({ error: "No tokens found for symbol" });
}

const data = await api.marketData({
  mode: "FULL",
  exchangeTokens: {
    ...(tokensFound.NSE && { NSE: [tokensFound.NSE] }),
    ...(tokensFound.BSE && { BSE: [tokensFound.BSE] })
  }
});


    // LTP using SmartAPI official V2 function
    // const data = await api.marketData({
    //   mode: "FULL",       // FULL / LTP
    //   exchangeTokens: {
    //     NSE: [result?.token]
    //   }
    // });

    // const tick = data?.data?.fetched?.[0];

    return res.json({
      ok: true,
      data
    });

  } catch(e){
    console.log("❌ BACKEND ERROR:", e.response?.data || e.message);
    return res.status(500).json({ error: e.message });
  }
}
