//server.jsx
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
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

    // Generate PDF
    const pdfBuffer = await generatePDF();

    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text,
        attachments: [
            {
                filename: 'sample.pdf', // Change filename as needed
                content: pdfBuffer
            },
            ...files.map(file => ({
                filename: file.originalname,
                path: file.path
            }))
        ]
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email' });
    }
});

// Function to generate PDF
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






// //Generate PDF
// const puppeteer = require('puppeteer');
// app.use(express.static(path.join(__dirname, 'public')));

// const sampleData = {
//     title: "Sample PDF",
//     content: "This is a sample PDF generated."
// };
// let pdfGenerationInProgress = false; 
// app.get('/generate-pdf', async (req, res) => {
//     try {

//         if (pdfGenerationInProgress) {
//             res.status(403).send('PDF generation is already in progress. Please try again later.');
//             return;
//         }

//         pdfGenerationInProgress = true; 
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
        
//         await page.setContent(`
//             <h1>${sampleData.title}</h1>
//             <p>${sampleData.content}</p>
//         `);

//         const pdf = await page.pdf({ format: 'A4' });
//         await browser.close();
        
//         pdfGenerationInProgress = false; 
        
//         res.setHeader('Content-Disposition', 'attachment; filename="sample.pdf"'); 
//         res.contentType("application/pdf");
//         res.send(pdf);
//     } catch (err) {
//         console.error('Error generating PDF:', err);
//         pdfGenerationInProgress = false; 
//         res.status(500).send('Error generating PDF');
//     }
// });
