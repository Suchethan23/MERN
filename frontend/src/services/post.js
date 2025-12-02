import axios from "axios";


const postData = async (data, endpoint) => {
  const API = `http://localhost:5000/api/auth/`+endpoint;
  try {
    const res = await axios.post(API, data);
    console.log("post success", res);
    return res;
  }
  catch (err) {
    console.log("data post failed", err.response);
    return err.response;
  }
}

export default postData;