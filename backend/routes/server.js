// server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const {
  generatePDF,
  downloadImage,
  transporter,
} = require("../CustomFunction/CustomeFunction");

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/send-email", upload.array("files", 10), async (req, res) => {
  const { from, to, subject, text } = req.body;
  const files = req.files;

  const pdfBuffer = await generatePDF();
  try {
    const excelBuffer = await generateExcel(req);
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      text: text,
      attachments: [
        {
          filename: "sample.pdf",
          content: pdfBuffer,
        },
        {
          filename: "carinfo.xlsx",
          content: excelBuffer,
        },
        ...files.map((file) => ({
          filename: file.originalname,
          path: file.path,
        })),
      ],
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error sending email" });
  }
});

// Download PDF file
router.get("/generate-pdf", async (req, res) => {
  const pdfBuffer = await generatePDF();
  res.setHeader("Content-Type", "application/pdf");
  res.send(pdfBuffer);
});

router.post("/download", async (req, res) => {
  const imageUrl = req.body.imageUrl;
  const filename = uuidv4() + ".jpg";
  try {
    const folderPath = path.join(__dirname, "images");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    await downloadImage(imageUrl, filename);
    res.send("Image download completed.");
  } catch (error) {
    res.status(500).send("Error downloading image.");
  }
});

module.exports = router;
