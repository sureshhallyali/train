const express = require('express');
const db = require('../../../db');
let carData = require('./queryData')

// console.log(carData);
async function generatePdfContents (){
    try{
        const result = await carData ();
        // console.log(result);
        return result;
    }catch(error){
        console.log("Error in generating PDF: ", error);
    }
}

async function main() {
    try {
        const pdfData = await generatePdfContents();
        return pdfData
    } catch (error) {
        console.error('Error:', error);
    }
}

async function generatePdfContentsAndMain() {
    const pdfData = await main();
    return pdfData;
}


const pdfContents = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample PDF</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
        }
        h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
        }
        p {
            color: #666;
            font-size: 16px;
            margin-bottom: 10px;
        }
        img {
            max-width: 100%;
            height: auto;
            margin-bottom: 20px;
        }
        ul {
            color: #666;
            font-size: 16px;
            margin-bottom: 20px;
            padding-left: 20px;
        }
        li {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
        <br><br><br>
    <div>
    <h1> THIS IS PDF CONTENT </h1>
    <p>This is HTML pdfContent file where content is added from .js file </p>
    <h2>HELLO WORLD!</h2>
    </div>

    <h1>Sample PDF</h1>
    <p>This is a sample PDF generated from external HTML file</p>
    <img src="https://images.pexels.com/photos/9406607/pexels-photo-9406607.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Sample Image">
    <p>Cities:</p>
    <ul>
        <li>Mumbai</li>
        <li>Jagnnath Puri</li>
        <li>Bengaluru</li>
    </ul>

    <div>
            <h1>Car Information</h1>
                <table>
                       <thead>
                            <tr>
                                <th>CAR MODEL</th>
                                <th>COMPANY</th>
                                <th>ENGINE POWER</th>
                                <th>COUNTRY</th>
                                <th>PRICE</th>
                            </tr>
                       </thead> 
                            <tbody>
                                 ${generatePdfContentsAndMain()}
                            </tbody>
                </table>
    </div>



</body>
</html>
`;


module.exports = pdfContents ;
