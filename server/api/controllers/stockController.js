// // import { getSmartApiSession } from "../../utils/angleone.js";

// // export async function liveData(req,res) {
// //   try{
// //     const { symbolToken } = req.params;

// //     const api = await getSmartApiSession();
    
// //     const ltpData = await api.ltpData(
// //       "NSE",
// //       req.query.symbol || "RELIANCE", // fallback symbol if not provided
// //       symbolToken
// //     );

// //     return res.json({
// //       token: symbolToken,
// //       ltp: ltpData.data.ltp,
// //       full: ltpData
// //     });

// //   } catch(e){
// //     console.log("❌ ERROR:", e);
// //     return res.status(500).json({ error: e.message });
// //   }
// // }


// import { getSmartApiSession } from "../../utils/angleone.js";

// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

// const tokens = require("../../utils/nse_final.json");

// // console.log(tokens);


// function getSymbolTokens(symbol) {
//   symbol = symbol.toLowerCase().trim();


//   const nse = tokens.find(t =>
//     (t.symbol.toLowerCase().includes(symbol) ||
//      t.name.toLowerCase().includes(symbol))
//   );

 
//   return { NSE: nse?.token || null};
// }

// export async function liveData(req,res) {
//   try {
//     const { symbolToken } = req.params;
// //    console.log(req.params,symbol, "in  live data req.params")

  

// //    const result = findToken(symbolToken)

// //    console.log(result, "in stockController");

//     const api = await getSmartApiSession();   // login session
//     console.log("🟢 Logged in — Fetching LTP...");


    
// const tokensFound = getSymbolTokens(symbolToken);
// console.log(tokensFound,"in stock controller");

// // if (!tokensFound.NSE && !tokensFound.BSE) {
// //   return res.status(404).json({ error: "No tokens found for symbol" });
// // }

// // const data = await api.marketData({
// //   mode: "FULL",
// //   exchangeTokens: {
// //     ...(tokensFound.NSE && { NSE: [tokensFound.NSE] }),
// //     ...(tokensFound.BSE && { BSE: [tokensFound.BSE] })
// //   }
// // });


//     // LTP using SmartAPI official V2 function
//     const data = await api.marketData({
//       mode: "FULL",       // FULL / LTP
//       exchangeTokens: {
//         NSE: [tokensFound]
//       }
//     });

//     console.log(tokensFound);

//     const tick = data?.data?.fetched?.[0];

//     return res.json({
//       ok: true,
//       data
//     });

//   } catch(e){
//     console.log("❌ BACKEND ERROR:", e.response?.data || e.message);
//     return res.status(500).json({ error: e.message });
//   }
// }


import { getSmartApiSession } from "../../utils/angleone.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const tokens = require("../../utils/nse_final.json");

// Find token by SYMBOL or NAME
function clean(str) {
  return str
    .toLowerCase()
    .replace(/limited|ltd|,|\.|&/gi, "")
    .replace(/\s+/g, " ") // collapse double spaces
    .trim();
}

function getSymbolTokens(symbol) {
  const input = clean(symbol);

  const stock = tokens.find(t => {
    const sym = clean(t.symbol);
    const name = clean(t.name);

    return sym === input || sym.includes(input) || name.includes(input);
  });

  return { 
    NSE: stock?.token || null,
    matched: stock?.symbol || null,
    fullName: stock?.name || null
  };
}


  

export async function liveData(req, res) {
  try {
    const { symbolToken } = req.params; // example → "ONGC"
    
    const api = await getSmartApiSession();
    console.log("🟢 Logged in — Fetching LTP...");

    const tokensFound = getSymbolTokens(symbolToken);
    console.log(tokensFound,"tokens found");

    if (!tokensFound.NSE) {
      return res.status(404).json({ error: `Symbol '${symbolToken}' token not found` });
    }

    // 🔥 SmartAPI format must be array of tokens
    const data = await api.marketData({
      mode: "FULL",
      exchangeTokens: {
        NSE: [tokensFound.NSE] // <-- FIX
      }
    });

    return res.json({
      ok: true,
      token: tokensFound.NSE,
      ltp: data?.data?.fetched?.[0]?.ltp,
      fullData: data?.data?.fetched?.[0]
    });

  } catch (e) {
    console.log("❌ BACKEND ERROR:", e.response?.data || e.message);
    return res.status(500).json({ error: e.message });
  }
}
