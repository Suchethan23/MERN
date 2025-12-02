import { useState } from "react";
import axios from "../services/api";

import FileUploader from "../components/FileUploader";
import { parseFile } from "../utils/fileParser";


export default function AddStock() {
  const [form, setForm] = useState({
    symbol: "",
    quantity: "",
    avgBuyPrice: "",
    sector: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const token = localStorage.getItem("token");
  const handleAdd = async (e) => {
    e.preventDefault();
    // const token = localStorage.getItem("token");

    await axios.post("/portfolio/add", form, {
      headers: { Authorization: `Bearer ${token}` }
    });

    window.location.href = "/portfolio";
  };

  const [data, setData] = useState([]);

 const handleUpload = async (file) => {
  try {
    const result = await parseFile(file);   // contains user, summary, holdings
    const token = localStorage.getItem("token");

    for (const h of result.holdings) {
      await axios.post("/portfolio/bulkadd", {
        companyName: h.stockName,
        symbol:h.stockName,
        quantity: h.quantity,
        avgBuyPrice: h.avgBuyPrice
          // or derive sector if available
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    alert("Upload complete");
  } catch (err) {
    console.error(err);
    alert("Failed to read file");
  }
};

  return (
    <div style={{ padding: "40px" }}>
      <h2>Add Stock</h2>

      <form onSubmit={handleAdd}>
        <input name="symbol" placeholder="Symbol (TCS, INFY)" onChange={handleChange} /><br />
        <input name="quantity" placeholder="Quantity" onChange={handleChange} /><br />
        <input name="avgBuyPrice" placeholder="Buy Price" onChange={handleChange} /><br />
        <input name="sector" placeholder="Sector (IT, Banking)" onChange={handleChange} /><br />

        <button type="submit">Add</button>
      </form>

      <h2>Upload Excel/CSV</h2>

      <FileUploader onSelect={handleUpload} />

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
