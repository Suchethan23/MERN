import { useState, useEffect,  } from "react";
import { useNavigate } from "react-router-dom";
import postData from "../services/post";
export default function Signin(){

    const [data, setData] = useState("");

    const navigate=useNavigate();

    const handleChange=(e)=>{
      setData({
        ...data,
        [e.target.name]:e.target.value
      });
    };

    const submit= async()=>{
      const response=await postData(data,"signup");
      if(response.status==200)
      {
        navigate("/login")
      }
      console.log(response.status);

      
    }
    return(
        <>
        
        <input type="email" name="email" placeholder="abc@gmail.com" onChange={handleChange}/>
        <input type="password" name="password" placeholder="enter your password" onChange={handleChange}/>
        <button onClick={submit}>signin</button>
        </>
    );
}