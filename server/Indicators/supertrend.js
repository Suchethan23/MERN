
import { getCandles } from "../api/controllers/historicalDataController.js";




export async function calculateSupertrend(token, period = 10, multiplier = 3) {


  const data = await getCandles("25574", "ONE_DAY");
  
  const result = [];
  const trList = [];

  let prevFinalUpper = null;
  let prevFinalLower = null;
  let prevTrend = null;

  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error("No candle data available. Skipping Supertrend calculation.");
    return [];
  }

  for (let i = 0; i < data.length; i++) {
    const [time, open, high, low, close, volume] = data[i];

    if (i === 0) {
      result.push({ time, supertrend: null, trend: null });
      continue;
    }

    const [, , , , prevClose] = data[i - 1];

    // --- True Range ---
    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );

    trList.push(tr);
    if (trList.length > period) trList.shift();

    // ATR not ready yet
    if (trList.length < period) {
      result.push({ time, supertrend: null, trend: null });
      continue;
    }

    const atr = trList.reduce((a, b) => a + b, 0) / period;

    // --- Basic Bands ---
    const hl2 = (high + low) / 2;
    const basicUpper = hl2 + multiplier * atr;
    const basicLower = hl2 - multiplier * atr;

    // --- Final Bands ---
    const finalUpper =
      prevFinalUpper === null ||
      basicUpper < prevFinalUpper ||
      prevClose > prevFinalUpper
        ? basicUpper
        : prevFinalUpper;

    const finalLower =
      prevFinalLower === null ||
      basicLower > prevFinalLower ||
      prevClose < prevFinalLower
        ? basicLower
        : prevFinalLower;

    // --- Trend & Supertrend ---
    let trend, st;

    if (prevTrend === null) {
      // First calculation - determine initial trend
      trend = close <= finalUpper ? "up" : "down";
    } else if (prevTrend === "up") {
      // In uptrend: switch to down only if close goes below finalLower
      trend = close <= finalLower ? "down" : "up";
    } else {
      // In downtrend: switch to up only if close goes above finalUpper
      trend = close >= finalUpper ? "up" : "down";
    }

    // Supertrend follows the appropriate band
    st = trend === "up" ? finalLower : finalUpper;

    prevFinalUpper = finalUpper;
    prevFinalLower = finalLower;
    prevTrend = trend;

    result.push({
      time,
      supertrend: st,
      trend,
      close
    });
  }

  return result.slice(-2);
}