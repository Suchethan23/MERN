import { createRequire } from "module";
const require = createRequire(import.meta.url);

import fs from "fs";

// Load JSON output from backtest
const tokens = require("../supertrend_backtest.json");
console.log(Object.keys(tokens).length)

function getReturns(trades) {
    let capital = 10000;

    for (let i = 0; i < trades.length; i++) {
        let qty = Math.floor(capital / trades[i].entry);
        let profit = qty * (trades[i].exit - trades[i].entry);
        capital += profit;
    }

    return capital;
}

function computeReturns() {
  const final_output={};
  let count=0;
    
    for (const stockName in tokens) {   // ✔ loop through object keys

        const trades = tokens[stockName];  // ✔ get trades array

        const finalCapital = getReturns(trades);  // ✔ compute return

        if(finalCapital>=10000)
        {
            count++;
        }


         final_output[stockName] = {
            stockName:stockName,
            finalCapital: finalCapital
        };
        console.log(`${stockName} → Final Capital: ₹${finalCapital}`);
    }
     fs.writeFileSync("supertrend_backtest_2.json", JSON.stringify(final_output, null, 2));

     console.log(count);
}

computeReturns();
