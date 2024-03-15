//server.jsx
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;

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

    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text,
        attachments: files.map(file => ({
            filename: file.originalname,
            path: file.path
        }))
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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app; 
