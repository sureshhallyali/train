const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const dotenv = require("dotenv");
const ExcelJS = require("exceljs");
const fs = require("fs");

const secreteKey = "secretKey";

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
  const { fname, lname, mobile, email, password, confirmPass } = req.body;
  db.query(
    "SELECT mobile FROM users WHERE mobile = ?",
    [mobile],
    async (error, result) => {
      if (error) {
        console.log(error);
      }

      if (result.length > 0) {
        return res.status(409).json({ message: "User already exists" });
      } else if (password !== confirmPass) {
        return res.status(401).json({ message: "Passwords don't match" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (fname, lname, mobile, email, password) VALUES (?, ?, ?, ?, ?)",
        [fname, lname, mobile, email, hashedPassword],
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

//Sign IN API
const signin = async (req, res) => {
  const { mobile, password } = req.body;

  db.query(
    "SELECT mobile, password FROM users WHERE mobile =?",
    [mobile],
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
      const token = jwt.sign({ mobile: existingUser.mobile }, secreteKey);

      db.query("UPDATE users SET token= ? WHERE mobile = ? ", [token, mobile]);

      //return the user with token
      return res.status(201).json({
        user: existingUser,
        token: token,
        message: "Logged In successfully",
      });
    }
  );
};

// jwt token verification & getting data fromat for user
const user = async (req, res) => {
  const token = req.header("authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized HTTP, Token not provided" });
  }

  try {
    //Verify the token
    const jwtToken = token.replace("Bearer ", "").trim(); // Fix Token Parsing

    const decode = jwt.verify(jwtToken, secreteKey);

    // Retrieve the user from the database using mobile number in the secod token
    db.query(
      "SELECT * FROM users WHERE mobile  =?",
      [decode.mobile],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length !== 1) {
          return res.status(400).json({ message: "The user does not exist." });
        }

        const user = results[0];
        // Check if the token from the database matches the token from the frontend

        if (user.token !== jwtToken) {
          return res
            .status(401)
            .json({ message: "Unauthorized, Token Mismatch" });
        }

        db.query("SELECT * FROM carInfo", (err, carResults) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ message: "Error retrieving carInfo data" });
          }

          const carData = JSON.parse(JSON.stringify(carResults));
          // Send carInfo data to the frontend
          return res.status(200).json({
            message: "Token Is Valid, You can access the data",
            carInfo: carData,
          });
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ message: "Unauthorised, Invalid Token   (IN CATCH BLOCK)" });
  }
};

const forgotPass = async (req, res) => {
  const { mobile, password, confirmPass } = req.body;
  try {
    db.query(
      "SELECT * FROM users WHERE mobile=?",
      [mobile],
      async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Server Error!" });
        }
        if (result.length != 1) {
          return res.status(400).json({ message: "Invalid Mobile Number." });
        } else if (password !== confirmPass) {
          return res
            .status(400)
            .json({ message: "Password and Confirm Password does not match." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query("UPDATE users SET password = ? WHERE mobile = ? ", [
          hashedPassword,
          mobile,
        ]);
        return res.status(200).json({ message: "Password Updated Succefully" });
      }
    );
  } catch (error) {
    console.log("Error In Catch :" + error);
  }
};

//Generate excel sheet of a data
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

module.exports = { signup, signin, user, forgotPass, generate_excel };