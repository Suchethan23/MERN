import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);

  console.log(token)

  if (!token) {
    alert("login to view stocks")
    return <Navigate to="/login" replace />;
  }

  return children;
}
