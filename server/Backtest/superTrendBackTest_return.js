// import { calculateSupertrend } from "../Indicators/supertrend.js";

// function getReturns(data)
// {
//     let initialCapital=10000;
//     // let capital;
//     for(let i=0;i<data.length;i++)
//     {
//         let num_of_shares=parseInt(initialCapital/data[i].entry);
//          initialCapital=initialCapital+(num_of_shares*data[i].exit-num_of_shares*data[i].entry);

//          console.log(initialCapital)
//     }
//     return initialCapital;
// }

// export async function supertrendBacktest() {
//     const data = await calculateSupertrend();

//     let entry = null;
//     let entrytimestamp = null;
//     let returns = [];

//     for (let i = 0; i < data.length - 1; i++) {

//         // Entry Condition (Down → Up)
//         if (data[i].trend === "down" && data[i + 1].trend === "up") {
//             entry = data[i + 1].close;
//             entrytimestamp = data[i + 1].time;
//         }

//         // Exit Condition (Up → Down)
//         else if (data[i].trend === "up" && data[i + 1].trend === "down") {

//             // skip exit if no entry exists
//             if (!entry) continue;

//             const exit = data[i + 1].close;
//             const exittimestamp = data[i + 1].time;

//             returns.push({
//                 entry,
//                 entrytimestamp,
//                 exit,
//                 exittimestamp
//             });

//             // Reset entry for next trade
//             entry = null;
//             entrytimestamp = null;
//         }
//         // else if(entry!==null&&data[i].close-entry>0.1*entry)
//         // {
//         //      const exit = data[i].close;
//         //     const exittimestamp = data[i].time;

//         //     returns.push({
//         //         entry,
//         //         entrytimestamp,
//         //         exit,
//         //         exittimestamp
//         //     });
//         //       entry = null;
//         //     entrytimestamp = null;
//         // }
//     }

//     console.log("Trades:", returns);

//     const capitalReturns=getReturns(returns);
//      console.log(capitalReturns)
//     return returns;

// }

import { calculateSupertrend } from "../Indicators/supertrend.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const tokens = require("../utils/nse_final.json");
import fs from "fs";

function getReturns(trades) {
    let capital = 10000;

    for (let i = 0; i < trades.length; i++) {
        let qty = Math.floor(capital / trades[i].entry);
        let profit = qty * (trades[i].exit - trades[i].entry);
        capital += profit;
    }

    return capital;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function supertrendBacktest() {

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

        result[stockName] = [];

        let entry = null;
        let entrytimestamp = null;

        for (let i = 0; i < data.length - 1; i++) {

            // ENTRY (down → up)
            if (data[i].trend === "down" && data[i + 1].trend === "up") {
                entry = data[i + 1].close;
                entrytimestamp = data[i + 1].time;
            }

            // EXIT (up → down)
            else if (entry !== null &&
                data[i].trend === "up" &&
                data[i + 1].trend === "down") {

                const exit = data[i + 1].close;
                const exittimestamp = data[i + 1].time;

                result[stockName].push({
                    entry,
                    entrytimestamp,
                    exit,
                    exittimestamp
                });

                entry = null;
                entrytimestamp = null;
            }
        }

        console.log(`Trades for ${stockName}:`, result[stockName]);

        const finalCapital = getReturns(result[stockName]);

         final_output[stockName] = {
            trades: result[stockName],
            finalCapital: finalCapital
        };
        console.log(`Final capital for ${stockName}: ₹${finalCapital}`);
    }

    console.log("Writing file...");

    fs.writeFileSync("supertrend_backtest_2.json", JSON.stringify(final_output, null, 2));

    console.log("File write completed!");

    return result;
}
