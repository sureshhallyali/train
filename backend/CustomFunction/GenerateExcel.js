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

module.exports.generateExcel = async (dummyData,keys,title) => {
 
  dummyData = extractColumns(dummyData, keys);

  return new Promise((resolve, reject) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("carinfo");

    // Add header row
    const titleRow = worksheet.addRow([title]);
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
