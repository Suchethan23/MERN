import { calculateSupertrend } from "../Indicators/supertrend.js";

function getAverageReturnInSupertrendRange(data) {
    const result = {};

    for (const date in data) {
        const arr = data[date];

        const avgHigh = (arr.reduce((sum, item) => sum + item.high, 0)) / arr.length;

        const entry = arr[0].entry; // same for entire date

        const avgReturn = (avgHigh - entry) / entry; // decimal return

        result[date] = {
            average_high: avgHigh,
            entry: entry,
            average_return: avgReturn*100,
        };
    }
    return result;
}

function getCombinedAvgAggregate(data){
    let result=0;

    for(const date in data)
    {
        result+=data[date].average_return;
        
    }
    return result/Object.keys(data).length;
}
export async function supertrendBacktest_avgReturn() {

    const data = await calculateSupertrend();
    console.log(data)
    let entry;

    let rangeHigh = [];

    for (let i = 0; i < data.length - 1; i++) {

        if (data[i].trend == "down" && data[i + 1].trend == "up") {
            entry = data[i + 1].close;
            let entrytimestamp = data[i + 1].time
            let j = i + 1;
            while (data[j].trend == "up" && j < data.length - 1) {
                if (entry < data[j].close) {

                    if (!rangeHigh[entrytimestamp]) {
                        rangeHigh[entrytimestamp] = [];  // initialize array for this entry price
                    }
                    rangeHigh[entrytimestamp].push({
                        high: data[j].close,
                        entry
                    });
                }
                j++;
            }

        }
    }
    const avg_return = getAverageReturnInSupertrendRange(rangeHigh);
    console.log(avg_return)
    const final_avg_return=getCombinedAvgAggregate(avg_return);
    console.log(final_avg_return);

}

supertrendBacktest();