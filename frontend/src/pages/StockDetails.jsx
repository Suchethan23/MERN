import { useEffect, useState } from "react";
import axios from "../services/api";
import { useParams } from "react-router-dom";
// import { getToken } from "../utils/tokenMapper";


export default function StockDetails() {
  const { symbol } = useParams();
  console.log(symbol);
//   const token=getToken(symbol)
//   console.log(token).
  const [data, setData] = useState(null);

  const loadData = async () => {
    const res = await axios.get(`/analytics/stock/${symbol}`);
    console.log(res);
    setData(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h2>{symbol} Details</h2>

      <p>Current Price: ₹{data.currentPrice}</p>
      <p>EMA 50: {data.ema50}</p>
      <p>RSI: {data.rsi}</p>
    </div>
  );
}
