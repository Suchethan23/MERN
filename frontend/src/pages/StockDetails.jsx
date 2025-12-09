import { useEffect, useState } from "react";
import axios from "../services/api";
import { useParams } from "react-router-dom";
// import { getToken } from "../utils/tokenMapper";


export default function StockDetails({symbols}) {
  const params = useParams(); 
  const symbol = params?.symbol ?? symbols; 
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

      <p>Current Price: ₹{data.ltp}</p>

      <p>52 Week High: ₹{data.fullData["52WeekHigh"]}</p>
      <p>52 Week Low: ₹{data.fullData["52WeekLow"]}</p>
      <p>Upper Circuit: ₹{data.fullData["upperCircuit"]}</p>
      <p>Lower Circuit: ₹{data.fullData["lowerCircuit"]}</p>
      <p>Days change: {data.fullData["percentChange"]}%</p>

      <p>EMA 50: {data.ema50}</p>
      <p>RSI: {data.rsi}</p>
    </div>
  );
}
