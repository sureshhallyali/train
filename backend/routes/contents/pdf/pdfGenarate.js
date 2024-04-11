const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const pdfContent =  require('./pdfContent');

const app = express();
app.use(express.json()); // Middleware for parsing

// Launching the browser and creating a new page:
async function generatePDF() {
    try{    
    // Sample Data
      const sampleData = {
        title: "Sample PDF",
        content: "This is a sample PDF generated.",
      };
    
      // Launching Puppeteer browser
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
    
    
      // Setting html content using template and sample data
      await page.setContent(`
            <h1>${sampleData.title}</h1>
            <p>${sampleData.content}</p>
            <p> ${pdfContent}</p>
        `);
    
        // const generate pdf
      const pdfBuffer = await page.pdf({ format: "A4" });
    
      // close browser
      await browser.close();
    
      return pdfBuffer;
    }catch(error){
        console.error('Error generating PDF:', error);
    }
}

module.exports = generatePDF ;