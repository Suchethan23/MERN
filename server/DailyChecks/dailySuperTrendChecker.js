import { createRequire } from "module";
const require = createRequire(import.meta.url);
const tokens = require("../utils/nse_final.json");
import fs from "fs";
import { calculateSupertrend } from "../Indicators/supertrend.js";

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export async function dailySuperTrendChecker() {

   const result = {};
    const final_output={};

    for (let t = 0; t < tokens.length; t++) {

        await delay(100); // ⭐ prevent API rate limiting

        const stockName = tokens[t].name;
        const data = await calculateSupertrend(tokens[t].token);

        // ⭐ Skip if no supertrend/candle data available
        if (!data || data.length === 0) {
            console.log(`Skipping ${stockName}, no supertrend data`);
            continue;
        }
        const latestData =data.slice(-2); 

        if(latestData[0].supertrend=="down"&&latestData[1].supertrend=="up")
        {
            final_output[stockName] = {
            trade: stockName,
            supertrend: `buy signal`,
        };
        }

        //  final_output[stockName] = {
        //     trades: stockName,
        //     supertrend: latestData,
        // };
        // console.log(`supertrend  for ${stockName} inserted`);
    }


    return final_output;
}

