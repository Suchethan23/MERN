import { useEffect, useState } from "react";
import axios from "../services/api";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  const loadAnalytics = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("/analytics/portfolio", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setAnalytics(res.data);
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (!analytics) return <p>Loading...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h2>Portfolio Analytics</h2>

      <p>Large-cap allocation: {analytics.largeCap}%</p>
      <p>Mid-cap allocation: {analytics.midCap}%</p>
      <p>Small-cap allocation: {analytics.smallCap}%</p>
    </div>
  );
}
