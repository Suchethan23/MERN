import { useEffect, useState } from "react";
import axios from "../services/api";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  const loadSummary = async () => {
    const token = localStorage.getItem("token");
    console.log(axios());

    const res = await axios.get("/portfolio/summary", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setSummary(res.data);
  };

  useEffect(() => {
    loadSummary();
  }, []);

  if (!summary) return <p>Loading...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h2>Dashboard</h2>

      <div>
        <p><strong>Total Invested:</strong> ₹{summary.totalInvested}</p>
        <p><strong>Current Value:</strong> ₹{summary.currentValue}</p>
        <p><strong>Overall P/L:</strong> ₹{summary.pnl}</p>
      </div>
    </div>
  );
}
