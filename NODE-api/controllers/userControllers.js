const mysql = require("mysql");
const mysql2 = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());

dotenv.config({ path: "./.env" });

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const signup = async (req, res) => {
  const { name, phone, email, password, confirmPass } = req.body;
  console.log(typeof phone);
  db.query(
    "SELECT * FROM signup WHERE phone = ?",
    [phone],
    async (error, result) => {
      if (error) {
        console.log(error);
      }
      console.log(result);

      if (result.length > 0) {
        return res.status(404).json({ message: "User already exists" });
      } else if (password !== confirmPass) {
        return res.status(400).json({ message: "Passwords don't match" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

   

      db.query(
        "INSERT INTO signup (name, phone, email, password) VALUES (?, ?, ?, ?)",
        [name, phone, email, hashedPassword],
        (error, result) => {
          if (error) {
            console.log(error);
            return res
              .status(500)
              .json({ message: "An error occurred while registering user" });
          }
          return res
            .status(201)
            .json({ message: "User registered successfully" });
        }
      );
    }
  );
};

const signin = async (req, res) => {
  const { phone, password } = req.body;
  db.query(
    "SELECT phone, password FROM signup WHERE phone =?",
    [phone],
    async (error, result) => {
      if (error) {
        console.log(error);
      }

      if (result.length != 1) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingUser = result[0];
      const matchPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!matchPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // create a token
      const token = jwt.sign({ phone: existingUser.phone }, "Helloworldjklj");
      return res
        .status(201)
        .json({
          user: existingUser,
          token: token,
          message: "Logged In successfully",
        });
    }
  );
};


const generate_excel = (req, res) => {
  const carInfo = req.params.carInfo;

   const query = `SELECT * FROM carInfo`;

   db.query(query, (err, rows) => {
    if (err) {
      console.error("Error Executing query:", err);
      res.status(500).send("Error fetching data from database");
      return;
    }
    //Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("carInfo");

    // Add data rows to worksheet
    const columns = ['ID', 'CarModel', 'Company', 'EnginePower', 'Country', 'PriceINR']
    rows.forEach((row) => {
      const rowData = [];
      columns.forEach((column) => {
        rowData.push(row[column]);
      });
      worksheet.addRow(rowData);
    });

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${carInfo}.xlsx"`
    );

    //Write the workbook to the response
    workbook.xlsx
      .write(res)
      .then(() => {
        res.end();
      })
      .catch((err) => {
        console.log("Error", err);
        res.status(500).send("Error generating Excel file");
      });
  });
};

module.exports = { signup, signin };


