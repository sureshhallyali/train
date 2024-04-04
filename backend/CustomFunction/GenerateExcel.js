const ExcelJS = require("exceljs");

function extractColumns(data, selectedColumns) {
  return data.map((item) => {
    const newObj = { ID: item.ID };
    selectedColumns.forEach((column) => {
      newObj[column] = item[column];
    });
    return newObj;
  });
}

module.exports.generateExcel = async (reqColumn) => {
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


  const selectedColumnsArray = Object.keys(reqColumn);
  const selectedColumns = selectedColumnsArray;
  dummyData = extractColumns(dummyData, selectedColumns);

  return new Promise((resolve, reject) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("carinfo");

    // Add header row
    const titleRow = worksheet.addRow(["Car Model Report"]);
    titleRow.font = { size: 14, bold: true };
    titleRow.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    const columnCount = Object.keys(dummyData[0]).length;
    worksheet.mergeCells(`A1:${String.fromCharCode(64 + columnCount)}1`);
    worksheet.addRow([]);

    // Define columns to include in the Excel file
    const columns = Object.keys(dummyData[0]);
    const headerRow = worksheet.addRow(columns);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
    });

    // Add data rows to the worksheet
    dummyData.forEach((row) => {
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
};
