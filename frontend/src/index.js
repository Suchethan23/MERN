import ReactDOM from "react-dom/client";
import App from "./App.js";
import AuthProvider from "./context/AuthContext.jsx";
import HoldingsProvider from "./context/HoldingsContext.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <HoldingsProvider><App /></HoldingsProvider>
      
    </AuthProvider>
  </BrowserRouter>
);
