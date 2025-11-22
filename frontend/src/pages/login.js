import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import postData from "../api/post";
export default function Login(){

    const [data, setData] = useState("");
    const navigate=useNavigate();

    const handleChange=(e)=>{
      setData({
        ...data,
        [e.target.name]:e.target.value
      });
    };

    const submit= async()=>{
      const response=await postData(data,"login");
      if(response.status==200)
      {
        localStorage.setItem("token", response.data.token);
        navigate("/")
      }
      console.log(response.status);

      
    }
    return(
        <>
        
        <input type="email" name="email" placeholder="abc@gmail.com" onChange={handleChange}/>
        <input type="password" name="password" placeholder="enter your password" onChange={handleChange}/>
        <button onClick={submit}>login</button>
        </>
    );
}