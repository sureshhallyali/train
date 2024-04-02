const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const https = require("https");
const nodemailer = require("nodemailer");
const db = require("../db");
const ExcelJS = require("exceljs");

module.exports.generatePDF = async () => {
  const sampleData = {
    title: "Sample PDF",
    content: "This is a sample PDF generated.",
  };

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(`
          <h1>${sampleData.title}</h1>
          <p>${sampleData.content}</p>
      `);

  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();

  return pdfBuffer;
};

module.exports.downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, function (response) {
        if (response.statusCode === 200) {
          const folderPath = path.join(__dirname, "images");
          const imagePath = path.join(folderPath, filename);
          const fileStream = fs.createWriteStream(imagePath);
          response.pipe(fileStream);
          fileStream.on("finish", function () {
            console.log("Image downloaded successfully.");
            fileStream.close();
            resolve();
          });
        } else {
          console.error(
            "Failed to download image. Status Code:",
            response.statusCode
          );
          reject(new Error("Failed to download image"));
        }
      })
      .on("error", function (err) {
        console.error("Error downloading image:", err);
        reject(err);
      });
  });
};

module.exports.transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "ruturajhalgekar25155@gmail.com",
    pass: "tvet sxih mfer nnul",
  },
});

module.exports.generateExcel = async (req) => {
  const query = "SELECT * FROM carinfo";

  return new Promise((resolve, reject) => {
    db.query(query, (err, rows) => {
      if (err) {
        console.error("Error Executing query:", err);
        reject("Error fetching data from database");
        return;
      }
      const workbook = new ExcelJS.Workbook(); // Create a new Excel workbook
      const worksheet = workbook.addWorksheet("carinfo");

      // Add header row
      const titleRow = worksheet.addRow(["Car Model Report"]);
      titleRow.font = { size: 14, bold: true };
      titleRow.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      const columnCount = Object.keys(rows[0]).length;
      worksheet.mergeCells(`A1:${String.fromCharCode(64 + columnCount)}1`);
      worksheet.addRow([]);

      // Define columns to include in the Excel file
      const columns = ["ID", "CarModel", "Company", "EnginePower", "Country"];
      const headerRow = worksheet.addRow(columns);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true };
      });

      // Add data rows to the worksheet
      rows.forEach((row) => {
        const rowData = [];
        columns.forEach((column) => {
          rowData.push(row[column]);
        });
        const dataRow = worksheet.addRow(rowData);
        dataRow.eachCell((cell) => {
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          };
        });
      });
      worksheet.columns.forEach((column) => {
        column.alignment = { horizontal: "center" };
        column.width = 20;
      });

      // Write the workbook buffer
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
};
