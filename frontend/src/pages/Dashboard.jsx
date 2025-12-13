// import { useEffect, useState } from "react";
// import axios from "../services/api";

// export default function Dashboard() {
//   const [summary, setSummary] = useState(null);

//   const loadSummary = async () => {
//     const token = localStorage.getItem("token");
//     console.log(axios());

//     const res = await axios.get("/portfolio/summary", {
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     setSummary(res.data);
//   };

//   useEffect(() => {
//     loadSummary();
//   }, []);

//   if (!summary) return <p>Loading...</p>;

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>Dashboard</h2>

//       <div>
//         <p><strong>Total Invested:</strong> ₹{summary.totalInvested}</p>
//         <p><strong>Current Value:</strong> ₹{summary.currentValue}</p>
//         <p><strong>Overall P/L:</strong> ₹{summary.pnl}</p>
//       </div>
//     </div>
//   );
// }

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useContext,useEffect,useState } from "react";
import api from "../services/api";
import { HoldingsContext } from "../context/HoldingsContext";
import OrdersCard from "../components/OrdersCard";
import ChartCard from "../components/ChartCard";
import DetailsPanel from "../components/DetailsPanel";
import FundCard from "../components/FundCard";
import InvestmentReturn from "../components/InvestmentReturn";
import Riskometer from "../components/Riskometer";
import { Computations } from "../utils/calculatePnL";
import { useSearchParams } from "react-router-dom";

// import { useComputations } from "../utils/calculatePnL";

export default function Dashboard() {

 const [holdings ] = useContext(HoldingsContext);
 const [holidingsGraph,setHoldingsGraph]=useState(null);

 const sorted=Computations(holdings);

 console.log("sorted", sorted)

//   const loadData = async () => {
//     try {
//       const res = await api.get(`/portfolio/holdingGraph`);
//       console.log(res, "in line 65 dashboard");
//       setHoldingsGraph(res.data);
//     } catch (err) {
//       console.error("Failed to load stock data:", err);
//       // setError("Failed to load stock data");
//     }
//   };
//  useEffect(() => {
//   loadData();
//   console.log("Dashboard updated holdings:", holdings);
// }, [holdings]);
  
  const chartData = [
    { name: "May", value: 3000 },
    { name: "Jun", value: 5000 },
    { name: "Jul", value: 4500 },
    { name: "Aug", value: 6000 },
    { name: "Sep", value: 7000 },
  ];

  return (
    <div className="flex bg-gray-50">
      {/* <Sidebar /> */}

      <div className="flex-1">
        {/* <Header /> */}

        <div className="p-6 grid grid-cols-4 gap-6">
          {/* Top Cards */}
          {sorted.slice(0,5).map((item )=>(<OrdersCard name={item.symbol} change={item.percentChange} currentvalue={parseInt(item.currentValue)}invested={parseInt(item.avgBuyPrice*item.quantity)}/>))}

          {/* Big Chart */}
          <div className="col-span-3">
            {/* <ChartCard title="S&P 500" data={chartData} /> */}
          </div>

          {/* Right Panel */}
          <DetailsPanel
            stock={{
              name: "S&P 500",
              prevClose: "4500.50",
              range: "4388 - 5415",
              marketCap: "90.3T",
              volume: "3,852,862",
              pe: "51.05",
              exchange: "Index",
            }}
          />

          {/* Funds */}
          <FundCard title="Digital Fund Direct" category="Technology" returns={37.74} />

          {/* Returns */}
          <InvestmentReturn
            items={[
              { name: "3m Return", value: 24.71 },
              { name: "6m Return", value: 48.51 },
              { name: "1yr Return", value: 95.82 },
            ]}
          />

          {/* Riskometer */}
          <Riskometer level="Moderate" />
          {/* <div>{JSON.stringify(holdings)}</div>; */}
        </div>
      </div>
    </div>
  );
}
