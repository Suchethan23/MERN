// import { useEffect, useState } from "react";
// import api from "../services/api";
// import { useParams } from "react-router-dom";
// import ChartCard from "../components/ChartCard";

// // import { getToken } from "../utils/tokenMapper";


// export default function StockDetails() {
//   const {isin} = useParams(); 
//  console.log(isin)
//   // console.log(symbol);
//   //   const token=getToken(symbol)
//   //   console.log(token).

 
//   const [data, setData] = useState(null);
//   const [candledata,setCandleData]=useState(null);

//   const loadData = async () => {
//     const res = await api.get(`/analytics/stock/${isin}`);
//     console.log(res,"in line 19 stockdetails");
//     setData(res.data);
//   };
// const loadCandles = async () => {
//   const res = await api.get(`/analytics/candles/${isin}`);
//   console.log(res.data.candles[0][4]);
//   const formatted = res.data.candles.map(c => ({
//     name: c[0].slice(0, 10),   // date only
//     value: c[4]                // close price
//   }));
//   setCandleData(formatted);
// };
// console.log(candledata)
//   useEffect(() => {
//     loadData();
//     loadCandles();
//   }, []);

//   if (!data) return <p>Loading...</p>;

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>{data.name} Details</h2>

//       <p>Current Price: ₹{data.ltp}</p>

//       <p>52 Week High: ₹{data.fullData["52WeekHigh"]}</p>
//       <p>52 Week Low: ₹{data.fullData["52WeekLow"]}</p>
//       <p>Upper Circuit: ₹{data.fullData["upperCircuit"]}</p>
//       <p>Lower Circuit: ₹{data.fullData["lowerCircuit"]}</p>
//       <p>Days change: {data.fullData["percentChange"]}%</p>

//       <p>EMA 50: {data.ema50}</p>
//       <p>RSI: {data.rsi}</p>

//       <ChartCard title={data.name} data={candledata}/>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";
 import ChartCard from "../components/ChartCard";

export default function StockDetails() {
  const { isin } = useParams();
  console.log(isin);

  const [data, setData] = useState(null);
  const [candleData, setCandleData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [volumeData, setVolumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("1D"); // For different timeframes

  const loadData = async () => {
    try {
      const res = await api.get(`/analytics/stock/${isin}`);
      console.log(res, "in line 19 stockdetails");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load stock data:", err);
      setError("Failed to load stock data");
    }
  };

  const loadCandles = async () => {
    try {
      const res = await api.get(`/analytics/candles/${isin}`);
      console.log("Candles response:", res.data);

      // Format for price chart (using close price)
      const formatted = res.data.candles.map((c) => ({
        time: c[0].split("T")[0], // "YYYY-MM-DD" format required by lightweight-charts
        value: parseFloat(c[4]), // Close price
        open: parseFloat(c[1]), // Open price
        high: parseFloat(c[2]), // High price
        low: parseFloat(c[3]), // Low price
      }));

      // Format for volume chart
      const formattedVolume = res.data.candles.map((c) => ({
        time: c[0].split("T")[0],
        volume: parseFloat(c[5]), // Volume
        value: parseFloat(c[4]), // Close for color coding
        open: parseFloat(c[1]), // Open for color coding
      }));

      setCandleData(res.data.candles);
      setChartData(formatted);
      setVolumeData(formattedVolume);
    } catch (err) {
      console.error("Failed to load candle data:", err);
      setError("Failed to load candle data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadData();
    loadCandles();
  }, [isin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stock data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Calculate price change
  const priceChange = data.fullData?.percentChange || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {data.name || isin}
            </h1>
            <p className="text-gray-500 text-sm">ISIN: {isin}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-800">
              ₹{data.ltp?.toFixed(2)}
            </div>
            <div
              className={`text-lg font-semibold ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {priceChange}%
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <MetricCard
            label="52W High"
            value={`₹${data.fullData?.["52WeekHigh"] || "-"}`}
            color="text-green-600"
          />
          <MetricCard
            label="52W Low"
            value={`₹${data.fullData?.["52WeekLow"] || "-"}`}
            color="text-red-600"
          />
          <MetricCard
            label="Upper Circuit"
            value={`₹${data.fullData?.upperCircuit || "-"}`}
            color="text-blue-600"
          />
          <MetricCard
            label="Lower Circuit"
            value={`₹${data.fullData?.lowerCircuit || "-"}`}
            color="text-orange-600"
          />
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Price Chart</h2>
          {/* Timeframe selector (optional) */}
          <div className="flex gap-2">
            {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  timeframe === tf
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {chartData && chartData.length > 0 ? (
          <ChartCard
            data={chartData}
            volumeData={volumeData}
            height={400}
            showGrid={true}
            showArea={true}
            showVolume={true}
            lineColor={isPositive ? "#00b386" : "#ef5350"}
            areaTopColor={
              isPositive
                ? "rgba(0, 179, 134, 0.4)"
                : "rgba(239, 83, 80, 0.4)"
            }
            areaBottomColor={
              isPositive
                ? "rgba(0, 179, 134, 0.0)"
                : "rgba(239, 83, 80, 0.0)"
            }
          />
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-500">
            No chart data available
          </div>
        )}
      </div>

      {/* Technical Indicators */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Technical Indicators
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <IndicatorCard label="EMA 50" value={data.ema50?.toFixed(2) || "-"} />
          <IndicatorCard label="RSI" value={data.rsi?.toFixed(2) || "-"} />
          <IndicatorCard
            label="Volume"
            value={
              volumeData && volumeData.length > 0
                ? formatVolume(volumeData[volumeData.length - 1].volume)
                : "-"
            }
          />
        </div>
      </div>

      {/* Raw Candle Data Table (Optional) */}
      {candleData && candleData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Historical Data
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="text-left py-3 px-2">Date</th>
                  <th className="text-right py-3 px-2">Open</th>
                  <th className="text-right py-3 px-2">High</th>
                  <th className="text-right py-3 px-2">Low</th>
                  <th className="text-right py-3 px-2">Close</th>
                  <th className="text-right py-3 px-2">Volume</th>
                </tr>
              </thead>
              <tbody>
                {candleData.slice(-10).reverse().map((candle, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">
                      {new Date(candle[0]).toLocaleDateString()}
                    </td>
                    <td className="text-right py-3 px-2">₹{candle[1]}</td>
                    <td className="text-right py-3 px-2 text-green-600">
                      ₹{candle[2]}
                    </td>
                    <td className="text-right py-3 px-2 text-red-600">
                      ₹{candle[3]}
                    </td>
                    <td className="text-right py-3 px-2 font-medium">
                      ₹{candle[4]}
                    </td>
                    <td className="text-right py-3 px-2 text-gray-600">
                      {formatVolume(candle[5])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function MetricCard({ label, value, color = "text-gray-800" }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function IndicatorCard({ label, value }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
    </div>
  );
}

// Helper Functions
function formatVolume(volume) {
  if (volume >= 10000000) {
    return (volume / 10000000).toFixed(2) + "Cr";
  } else if (volume >= 100000) {
    return (volume / 100000).toFixed(2) + "L";
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(2) + "K";
  }
  return volume.toString();
}