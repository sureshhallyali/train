// server.js
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');

const db = require('../db'); 
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;

const https = require('https');
const fs = require('fs');
const puppeteer = require('puppeteer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'ruturajhalgekar25155@gmail.com',
        pass: 'tvet sxih mfer nnul'
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/send-email', upload.array('files', 10), async (req, res) => {
    console.log(req.body);
    console.log(req.files);

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
                    filename: 'sample.pdf',
                    content: pdfBuffer
                },
                {
                    filename: 'carinfo.xlsx', 
                    content: excelBuffer
                },
                ...files.map(file => ({
                    filename: file.originalname,
                    path: file.path
                }))
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email' });
    }
});

// Endpoint to serve the PDF file
app.get ('/generate-pdf', async (req, res) => {
    const pdfBuffer = await generatePDF();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);

})


//generate PDF
async function generatePDF() {
    const sampleData = {
        title: "Sample PDF",
        content: "This is a sample PDF generated."
    };

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
        
    await page.setContent(`
        <h1>${sampleData.title}</h1>
        <p>${sampleData.content}</p>
    `);

    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    return pdfBuffer;
}

//generate Excel
async function generateExcel(req) {
    const carinfo = req.params.carinfo;

    const query = 'SELECT * FROM carInfo';

    return new Promise((resolve, reject) => {
        db.query(query, (err, rows) => {
            if (err) {``
                console.error("Error Executing query:", err);
                reject("Error fetching data from database");
                return;
            }
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("carinfo");

            const columns = ['ID', 'CarModel', 'Company', 'EnginePower', 'Country']
            rows.forEach((row) => {
                const rowData = [];
                columns.forEach((column) => {
                    rowData.push(row[column]);
                });
                worksheet.addRow(rowData);
            });
            
            workbook.xlsx.writeBuffer().then(buffer => {
                resolve(buffer);
            }).catch(err => {
                console.error("Error generating Excel file:", err);
                reject("Error generating Excel file");
            });
        });
    });
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app;





//image.jsx
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        https.get(url, function(response) {
            if (response.statusCode === 200) {
                const folderPath = path.join(__dirname, 'images');
                const imagePath = path.join(folderPath, filename); 
                const fileStream = fs.createWriteStream(imagePath);
                response.pipe(fileStream);
                fileStream.on('finish', function() {
                    console.log('Image downloaded successfully.');
                    fileStream.close();
                    resolve();
                });
            } else {
                console.error('Failed to download image. Status Code:', response.statusCode);
                reject(new Error('Failed to download image'));
            }
        }).on('error', function(err) {
            console.error('Error downloading image:', err);
            reject(err);
        });
    });
}

app.post('/download', async (req, res) => {
    const imageUrl = req.body.imageUrl; 
    const filename = uuidv4() + '.jpg'; 
    try {
        const folderPath = path.join(__dirname, 'images');
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        await downloadImage(imageUrl, filename);
        res.send('Image download completed.'); 
    } catch (error) {
        res.status(500).send('Error downloading image.');
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

