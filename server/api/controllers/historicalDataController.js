import { getSmartApiSession } from "../../utils/angleone.js";
import { getDateRange } from "../../utils/getDateRange.js";

export async function getCandles(symboltoken, interval = "ONE_DAY") {
  try {
    const smart_api = await getSmartApiSession();  // 🔥 uses your existing login
    // console.log(symboltoken, fromdate,todate, "in line 6 getcandles")

    const {fromdate,todate}=getDateRange(2000);

    console.log(fromdate,todate,"in line 11 getcandles")

    const res = await smart_api.getCandleData({
      exchange: "NSE",
      symboltoken,            // Example token: "3045"
      interval:"ONE_DAY",               // values: ONE_MINUTE, FIVE_MINUTE, DAY
      fromdate:fromdate,               // "2024-01-01 09:15"
      todate:todate        // "2024-12-31 15:30"
    });

    // console.log("📊 Candle Data:", res.data);
    return res.data;          // returns OHLC array

  } catch (err) {
    console.log("❌ Candle Fetch Error:", err.response?.data || err.message);
    throw err;
  }
}


// import { getSmartApiSession } from "../../utils/angleone.js";
// import { getDateRange } from "../../utils/getDateRange.js";

// export async function getCandles(symboltoken, interval = "ONE_DAY") {
//   try {
//     console.log("🔍 Starting getCandles for:", symboltoken);
    
//     const smart_api = await getSmartApiSession();
//     console.log("✅ SmartAPI session obtained");

//     const { fromdate, todate } = getDateRange(2000);
//     console.log("📅 Date range:", fromdate, "to", todate);

//     // Log the exact parameters being sent
//     const params = {
//       exchange: "NSE",
//       symboltoken,
//       interval: "ONE_DAY",
//       fromdate: fromdate,
//       todate: todate
//     };
//     console.log("📤 Sending request with params:", JSON.stringify(params, null, 2));

//     const res = await smart_api.getCandleData(params);

//     // Log the full response object
//     console.log("📥 Full response:", JSON.stringify(res, null, 2));
//     console.log("📊 Response status:", res?.status);
//     console.log("📊 Response message:", res?.message);
//     console.log("📊 Candle Data:", res?.data);

//     // Check if response is successful
//     if (!res || !res.status) {
//       throw new Error(`API returned unsuccessful status: ${res?.message || 'Unknown error'}`);
//     }

//     if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
//       console.warn("⚠️ No candle data in response");
//       return null;
//     }

//     console.log(`✅ Successfully fetched ${res.data.length} candles`);
//     return res.data;

//   } catch (err) {
//     console.error("❌ Candle Fetch Error Details:");
//     console.error("  - Message:", err.message);
//     console.error("  - Response data:", err.response?.data);
//     console.error("  - Response status:", err.response?.status);
//     console.error("  - Full error:", err);
//     throw err;
//   }
// }