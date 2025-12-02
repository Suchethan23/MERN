import fs from "fs";


import axios from "axios";
import https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false   // ⛔ bypass SSL altname restriction
});

export async function loadTokens() {
  console.log("⏳ Downloading token list...");
  
  const { data } = await axios.get(
    "https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json",
    { httpsAgent: agent }
  );
  console.log(data);
fs.writeFileSync("tokens.json", JSON.stringify(data)); // optional cache in file
  return data;
}

loadTokens();