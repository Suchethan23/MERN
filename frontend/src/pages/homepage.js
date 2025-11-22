import {useNavigate} from "react-router-dom";
export default function HomePage()
{
    const navigate = useNavigate();
    const submit=(type)=>{

        if(type==="login")
        {
            navigate("/login");
        }
        else{
            navigate("/signin");
        }

    }
    return(
        <>
         <button onClick={()=>submit("login")}>login</button>
          <button onClick={()=>submit("signin")}>signin</button>
        </>
    )
}