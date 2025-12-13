import { createContext, useContext,useEffect,useState} from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";

export const HoldingsContext=createContext();
export default function HoldingsProvider({children}){

      const location = useLocation();
   const [holdings, setHoldings] = useState([]); 
 useEffect(() => {
    // 🔥 load holdings only on /portfolio page
    if (location.pathname === "/portfolio") {
      loadHoldings();
    }
  }, [location.pathname]);
  const loadHoldings = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("/portfolio/all", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setHoldings(res.data.portfolio);
  };
console.log(holdings, "in line 25 in holidings context");
 

    return(
        <HoldingsContext.Provider value={[holdings,setHoldings]}>
        {children}
        </HoldingsContext.Provider>
    )
}