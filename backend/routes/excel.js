const express = require("express");
const ExcelJS = require("exceljs");
const db = require("../db");
const { generateExcel } = require("../CustomFunction/GenerateExcel");
const app = express();

app.get("/getCarInfoColumns", (req, res) => {
  try {
    const query = "SHOW COLUMNS FROM carinfo";
    db.query(query, (err, rows) => {
      if (err) {
        console.error("Error fetching column names:", err);
        res.status(500).json({ error: "Error fetching column names" });
        return;
      }
      const columns = rows.map((row) => row.Field);
      res.json(columns);
    });
  } catch (error) {
    console.error("Error fetching column names:", error);
    res.status(500).json({ error: "Error fetching column names" });
  }
});

app.post("/generate-excel-CarModel", (req, res) => {
  const excelBuffer = generateExcel(req.body)
    .then((excelBuffer) => {
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.send(excelBuffer);
    })
    .catch((error) => {
      console.error("Error generating Excel:", error);
      res.status(500).json({ error: "Error generating Excel" });
    });
});

module.exports = app;
