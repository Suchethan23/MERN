import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);

  return (
    <nav style={{ padding: "20px", background: "#eee" }}>
      <Link to="/dashboard" style={{ marginRight: "20px" }}>Dashboard</Link>
      <Link to="/portfolio" style={{ marginRight: "20px" }}>Portfolio</Link>
      <Link to="/analytics" style={{ marginRight: "20px" }}>Analytics</Link>

      {token ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
