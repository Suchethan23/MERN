import { useEffect, useState, useContext } from "react";
import { FaTimes } from "react-icons/fa";
import { HoldingsContext } from "../context/HoldingsContext";
import { Link } from "react-router-dom";
import api from "../services/api"; // Use axios instance
import StockDetails from "./StockDetails";

export default function Portfolio() {
  const [holdings, setHoldings] = useContext(HoldingsContext);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Load holdings from backend
  const loadHoldings = async () => {
    try {
      const res = await api.get("/portfolio/all");
      setHoldings(res.data);
    } catch (error) {
      console.error("Failed to load holdings:", error.response || error.message);
    }
  };

  // Delete stock
  const handleDelete = async (id) => {
    try {
      console.log("Deleting ID:", id);
      await api.delete(`/portfolio/removeStock/${id}`);
      setHoldings(holdings.filter((h) => h._id !== id));
      setShowPopup(false);
    } catch (error) {
      console.error("Delete failed :", error.response || error.message);
    }
  };

  useEffect(() => {
    loadHoldings();
  }, []);

  return (
    <div className="p-10 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Portfolio Overview</h2>
        <Link to="/add-stock">
          <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-xl shadow-md">
            + Add Stock
          </button>
        </Link>
      </div>

      {/* Portfolio Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="pb-3 font-medium">Symbol</th>
              <th className="pb-3 font-medium">Sector</th>
              <th className="pb-3 font-medium">Market Price</th>
               <th className="pb-3 font-medium">Buy Price</th>
              <th className="pb-3 font-medium">Qty</th>
             
              
           
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => (
              <tr
                key={h._id}
                className="border-b last:border-none hover:bg-gray-50 transition group"
              >
                <td className="py-3 flex items-center justify-between">
                  <Link to={`/stock/${h.symbol}`} className="text-blue-500 hover:underline">
                    {h.symbol}
                  </Link>
                  <FaTimes
                    className="text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setDeleteTarget(h);
                      setShowPopup(true);
                    }}
                  />
                </td>
                <td className="py-3 text-gray-600">{h.sector}</td>
                <td className="py-3 text-gray-600" ><StockDetails symbols={h.symbol}/></td>
                <td className="py-3">{h.quantity}</td>
                <td className="py-3 font-medium text-gray-700">₹{h.avgBuyPrice}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Popup */}
      {showPopup && deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete <strong>{deleteTarget.symbol}</strong>?
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => handleDelete(deleteTarget._id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
