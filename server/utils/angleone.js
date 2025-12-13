import { SmartAPI } from "smartapi-javascript";
import { authenticator } from "otplib";
import dotenv from "dotenv";

dotenv.config();

const smart_api = new SmartAPI({
  api_key: process.env.ANGEL_API_KEY,
});

let sessionData = null;

export const getSmartApiSession = async () => {
  try {
    // 1️⃣ Use access_token instead of jwtToken
    if (sessionData && sessionData.access_token) {
      return smart_api;
    }

    // 2️⃣ Generate TOTP every login
    const totp = authenticator.generate(process.env.ANGEL_TOTP_SECRET);

    // 3️⃣ Perform login
    const response = await smart_api.generateSession(
      process.env.ANGEL_CLIENT_CODE,
      process.env.ANGEL_PASSWORD,
      totp
    );

    if (response.status) {
      sessionData = response.data;
      console.log(sessionData,"in smart api line 32")
      // console.log("🔐 Logged in — Access Token:", sessionData.access_token);
      return smart_api;
    }

    throw new Error("Login failed: " + response.message);

  } catch (error) {
    console.error("❌ SmartAPI Login Error:", error.response?.data || error.message);
    throw error;
  }
};


// import { SmartAPI } from "smartapi-javascript";
// import { authenticator } from "otplib";
// import dotenv from "dotenv";

// dotenv.config();

// const smart_api = new SmartAPI({
//   api_key: process.env.ANGEL_API_KEY,
// });

// let sessionData = null;

// export const getSmartApiSession = async () => {
//   try {
//     // ✅ Check if we already have a valid session
//     if (sessionData && sessionData.jwtToken) {
//       // Set the access token before returning
//       smart_api.setAccessToken(sessionData.jwtToken);
//       return smart_api;
//     }

//     // 🔐 Generate TOTP for fresh login
//     const totp = authenticator.generate(process.env.ANGEL_TOTP_SECRET);

//     // 🚀 Perform login
//     const response = await smart_api.generateSession(
//       process.env.ANGEL_CLIENT_CODE,
//       process.env.ANGEL_PASSWORD,
//       totp
//     );

//     if (response.status) {
//       sessionData = response.data;
//       console.log("✅ Logged in successfully");
      
//       // ✅ CRITICAL: Set the access token immediately after login
//       smart_api.setAccessToken(sessionData.jwtToken);
      
//       return smart_api;
//     }

//     throw new Error("Login failed: " + response.message);

//   } catch (error) {
//     console.error("❌ SmartAPI Login Error:", error.response?.data || error.message);
//     throw error;
//   }
// };