const express = require("express"); 
const ExcelJS = require("exceljs"); 
const db = require("../db"); 
const app = express(); 

// Endpoint to get column names of carinfo table
app.get("/getCarInfoColumns", (req, res) => {
  try {
    const query = "SHOW COLUMNS FROM carinfo"; // SQL query to fetch column names
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

// generate Excel file for car model
app.post("/generate-excel-CarModel", async (req, res) => {
  try {
    const excelBuffer = await generateExcel(req.body); // Generate Excel buffer
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ); 
    res.send(excelBuffer); 
  } catch (error) {
    console.error("Error generating Excel:", error); 
    res.status(500).json({ error: "Error generating Excel" }); 
  }
});

// Function to generate Excel file
async function generateExcel(req) {
  console.log(req); 

  // SQL query to fetch data from the database based on request parameters
  const columns = Object.keys(req)
    .filter((key) => req[key]) 
    .join(", "); 
  const query = `SELECT ID, ${columns} FROM carinfo`;


  return new Promise((resolve, reject) => {
    db.query(query, (err, rows) => {
      if (err) {
        console.error("Error Executing query:", err);
        reject("Error fetching data from database"); 
        return;
      }
      const workbook = new ExcelJS.Workbook(); // Creating a new Excel workbook
      const worksheet = workbook.addWorksheet("carinfo"); 

      // Adding title row to the worksheet
      const titleRow = worksheet.addRow(["Car Model Report"]);
      titleRow.font = { size: 14, bold: true }; 
      titleRow.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      }; 
      
      // Aligning text in title row
      const columnCount = Object.keys(rows[0]).length;
      worksheet.mergeCells(`A1:${String.fromCharCode(64 + columnCount)}1`); 
      worksheet.addRow([]); 

      // Defining columns to include in the Excel file
      const columns = ["ID", ...Object.keys(req)]; 
      const headerRow = worksheet.addRow(columns); 
      headerRow.eachCell((cell) => {
        cell.font = { bold: true }; 
      });

      // Adding data rows to the worksheet
      rows.forEach((row) => {
        const rowData = [];
        columns.forEach((column) => {
          rowData.push(row[column]); // Extracting data for each column
        });
        const dataRow = worksheet.addRow(rowData); // Adding data row to the worksheet
        dataRow.eachCell((cell) => {
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          }; 
        });
      });

      // Styling columns and setting width
      worksheet.columns.forEach((column) => {
        column.alignment = { horizontal: "center" };
        column.width = 20; 
      });

      // Writing the workbook buffer
      workbook.xlsx
        .writeBuffer()
        .then((buffer) => {
          resolve(buffer); 
        })
        .catch((err) => {
          console.error("Error generating Excel file:", err); 
          reject("Error generating Excel file"); 
        });
    });
  });
}

module.exports = app; 
