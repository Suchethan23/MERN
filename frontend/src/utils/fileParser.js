// utils/fileParser.js
import * as XLSX from "xlsx";

export const parseFile = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // row-wise array

        // ------------------------
        // 1. Extract Header details
        // ------------------------
        const name = raw[0][1];
        const clientCode = raw[1][1];
        const holdingDate = raw[3][0]?.split("as on ")[1];

        // ------------------------
        // 2. Extract Summary values
        // ------------------------
        const investedValue = raw[7][1];
        const closingValue = raw[8][1];
        const unrealisedPL = raw[9][1];

        // ------------------------
        // 3. Detect table start row
        // ------------------------
        const tableStart = raw.findIndex(r => r.includes("Stock Name"));

        const tableRows = raw.slice(tableStart + 1).filter(row => row.length > 0); // clean empty rows

        const holdings = tableRows.map(r => ({
          stockName: r[0],
          isin: r[1],
          quantity: Number(r[2]),
          avgBuyPrice: Number(r[3]),
          buyValue: Number(r[4]),
          closingPrice: Number(r[5]),
          closingValue: Number(r[6]),
          unrealisedPL: Number(r[7])
        }));

        resolve({
          user: { name, clientCode, holdingDate },
          summary: { investedValue, closingValue, unrealisedPL },
          holdings
        });
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      reject(err);
    }
  });
};
