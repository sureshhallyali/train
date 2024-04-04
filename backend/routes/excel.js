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

  let dummyData = [
    { ID: 1, Brand: "Toyota", Model: "Camry", Year: 2020 },
    { ID: 2, Brand: "Honda", Model: "Civic", Year: 2019 },
    { ID: 3, Brand: "Ford", Model: "Fusion", Year: 2018 },
    { ID: 4, Brand: "Nissan", Model: "Altima", Year: 2021 },
    { ID: 5, Brand: "Chevrolet", Model: "Cruze", Year: 2017 },
    { ID: 6, Brand: "Hyundai", Model: "Elantra", Year: 2022 },
    { ID: 7, Brand: "Kia", Model: "Soul", Year: 2016 },
    { ID: 8, Brand: "Volkswagen", Model: "Golf", Year: 2023 },
    { ID: 9, Brand: "BMW", Model: "X5", Year: 2015 },
    { ID: 10, Brand: "Mercedes-Benz", Model: "C-Class", Year: 2024 },
  ];


  const keys= ["ID","Brand","Model"]  
  const title ="Car Model Report";


  const excelBuffer = generateExcel(dummyData,keys, title)
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
