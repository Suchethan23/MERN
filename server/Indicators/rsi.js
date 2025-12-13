import { getCandles } from "../api/controllers/historicalDataController.js";

export async function computeRSI( period = 14) {
 
    const candles=await getCandles('17675',"ONE_DAY");
   const closes = candles.map(c => c[4]);     // close price = index 4
  const timestamps = candles.map(c => c[0]); // time = index 0

  const n = closes.length;
  const result = Array(n).fill(null).map(() => ({ time: null, rsi: null }));

  if (n < period + 1) {
    return result.map((_, i) => ({
      time: timestamps[i],
      rsi: null
    }));
  }

  let gainSum = 0;
  let lossSum = 0;

  // First period calculation
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gainSum += diff;
    else lossSum += -diff;
  }

  let avgGain = gainSum / period;
  let avgLoss = lossSum / period;

  // Fill timestamps
  for (let i = 0; i < n; i++) {
    result[i].time = timestamps[i];
  }

  // First RSI value (at index = period)
  result[period].rsi =
    avgLoss === 0 ? 100 :
    avgGain === 0 ? 0 :
    100 - (100 / (1 + (avgGain / avgLoss)));

  // Continue smoothing
  for (let i = period + 1; i < n; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;

    avgGain = ((avgGain * (period - 1)) + gain) / period;
    avgLoss = ((avgLoss * (period - 1)) + loss) / period;

    if (avgLoss === 0) result[i].rsi = 100;
    else if (avgGain === 0) result[i].rsi = 0;
    else {
      const rs = avgGain / avgLoss;
      result[i].rsi = 100 - (100 / (1 + rs));
    }
  }

  return result;
}
