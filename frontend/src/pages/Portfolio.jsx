import { useEffect, useState ,useContext} from "react";
import { HoldingsContext } from "../context/HoldingsContext";
import axios from "../services/api";

export default function Portfolio() {
  const [holdings, setHoldings] = useContext(HoldingsContext);

  const loadHoldings = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("/portfolio/all", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setHoldings(res.data);
  };
console.log(holdings);
  useEffect(() => {
    loadHoldings();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Your Portfolio</h2>

      <a href="/add-stock">
        <button>Add Stock</button>
      </a>

      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Qty</th>
            <th>Buy Price</th>
            <th>Sector</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => (
            <tr key={h._id}>
              <td>{h.symbol}</td>
              <td>{h.quantity}</td>
              <td>{h.avgBuyPrice}</td>
              <td>{h.sector}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
