// // const mysql = require("mysql");
// const mysql2 = require('mysql2');
 
// const db = mysql2.createConnection({
//     host: process.env.DATABASE_HOST,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE
//   });

//   // console.log('Connected to MySQL as id checking in db.js folder', db.threadId);
//   module.exports = db


  // db.js

const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST, // accessing environment variable
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id', connection.threadId);
});

module.exports = connection;
