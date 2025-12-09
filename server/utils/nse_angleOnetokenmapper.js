import fs from "fs";

const nse = JSON.parse(fs.readFileSync("nse_sector_dataset.json","utf8"));           // main dataset
const tokens = JSON.parse(fs.readFileSync("tokens.json","utf8"));     // token list

// Function to normalize symbol
const clean = sym => sym.replace("-EQ","").replace("-BE","").split("-")[0].trim();

const final = nse.map(stock => {
    const match = tokens.find(t => clean(t.symbol) === stock.symbol);

    return {
        ...stock,
        token: match?.token || null             // If found, insert token
    };
});

fs.writeFileSync("nse_final.json", JSON.stringify(final,null,2));
console.log("Merged successfully → nse_final.json");
