import { createContext, useContext,useEffect,useState} from "react";
import api from "../services/api";

export const HoldingsContext=createContext();
export default function HoldingsProvider({children}){

    
   const [holdings, setHoldings] = useState([]); 
 useEffect(() => {
    loadHoldings();
  }, []);
  const loadHoldings = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("/portfolio/all", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setHoldings(res.data);
  };
console.log(holdings);
 

    return(
        <HoldingsContext.Provider value={[holdings,setHoldings]}>
        {children}
        </HoldingsContext.Provider>
    )
}