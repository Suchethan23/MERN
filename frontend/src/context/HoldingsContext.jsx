import { createContext, useState} from "react";

export const HoldingsContext=createContext();
export default function HoldingsProvider({children}){

    const [holdings,setHoldings]=useState([]);

    return(
        <HoldingsContext.Provider value={[holdings,setHoldings]}>
        {children}
        </HoldingsContext.Provider>
    )
}