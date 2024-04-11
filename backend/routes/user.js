const express = require("express");
const { signup, signin } = require("../controllers/userControllers");
const generatePDF = require('./contents/pdf/pdfGenarate');

const router = express.Router();



router.post("/signup", signup);

router.post("/signin", signin);

router.get("/generate-pdf", async (req, res) => {
    try{
      const pdfBuffer = await generatePDF();
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
    }catch(error){
      console.error('Error generating PDF:', error);
      res.status(500).send('Failed to generate PDF');
    }
  });


module.exports = router; //exporting the module so it can be used in other files
