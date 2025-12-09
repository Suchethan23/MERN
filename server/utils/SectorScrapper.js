// import fs from "fs";


// import axios from "axios";
// import https from "https";

// const agent = new https.Agent({
//   rejectUnauthorized: false   // ⛔ bypass SSL altname restriction
// });

// export async function loadTokens() {
//   console.log("⏳ Downloading token list...");
  
//   const { data } = await axios.get(
//     "https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json",
//     { httpsAgent: agent }
//   );
//   console.log(data);
// fs.writeFileSync("tokens.json", JSON.stringify(data)); // optional cache in file
//   return data;
// }

// loadTokens();


// import axios from "axios";
// import * as cheerio from "cheerio";
// import fs from "fs";

// const baseURL = "https://ticker.finology.in/sector";

// async function getSectorWiseData() {
//     const { data } = await axios.get(baseURL);
//     const $ = cheerio.load(data);

//     let sectors = [];

//     // Get sector links
//     $("a").each((i, el) => {
//         const link = $(el).attr("href");
//         if (link && link.includes("/sector/")) {
//             sectors.push("https://ticker.finology.in" + link);
//         }
//     });

//     let final = [];

//     for (let sectorURL of sectors) {
//         console.log("Fetching:", sectorURL);

//         const { data } = await axios.get(sectorURL);
//         const $ = cheerio.load(data);

//         const sectorName = $("h1").text().trim();

//         $("table tbody tr").each((i, el) => {
//             const cols = $(el).find("td");
//             final.push({
//                 company: $(cols[0]).text().trim(),
//                 industry: $(cols[3]).text().trim(),
//                 sector: sectorName
//             });
//         });
//     }

//     fs.writeFileSync("sector_mapped_list.json", JSON.stringify(final, null, 2));
//     console.log("Saved → sector_mapped_list.json");
// }

// getSectorWiseData();


import axios from "axios";
import fs from "fs";

const stocks = JSON.parse(fs.readFileSync("tokens.json", "utf8"));

const headers = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json",
    "Referer": "https://www.nseindia.com/"
};

async function getSector(symbol) {
    try {
        const url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;
        const { data } = await axios.get(url, { headers });
        return data?.industryInfo || null;
    } catch {
        console.log("retry:", symbol);
        return null;
    }
}

async function buildFinalDataset() {
    let result = [];

    for (let stock of stocks) {
        const symbol = stock.SYMBOL;
        console.log("Fetching:", symbol);

        const info = await getSector(symbol);

        result.push({
            symbol,
            name: stock["NAME OF COMPANY"],
            isin: stock["ISIN NUMBER"],
            sector: info?.sector || "Unknown",
            industry: info?.industry || "Unknown"
        });

        await new Promise(r => setTimeout(r, 300)); // avoid IP blocking
    }

    fs.writeFileSync("nse_sector_dataset.json", JSON.stringify(result, null, 2));
    console.log("Created → nse_sector_dataset.json");
}

buildFinalDataset();
