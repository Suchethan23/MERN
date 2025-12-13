import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/signin";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import AddStock from "./pages/AddStock";
import StockDetails from "./pages/StockDetails";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-stock"
          element={
            <ProtectedRoute>
              <AddStock />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stock/:isin"
          element={
            <ProtectedRoute>
              <StockDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
