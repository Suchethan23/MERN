import { useContext } from "react";
import HoldingsProvider, { HoldingsContext } from "../context/HoldingsContext";
import { AuthContext } from "../context/AuthContext";

 export const  Computations=(holdings)=>{
const sorted = holdings.sort((x, y) => (y.avgBuyPrice* y.quantity) - (x.avgBuyPrice* x.quantity));

   return sorted;
}

