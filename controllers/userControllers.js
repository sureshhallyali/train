const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const dotenv = require("dotenv");

const secreteKey = "secreteKey";

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
      return res.status(201).json({user:existingUser, token:token, message: "Logged In successfully" });
    }
  );
};

module.exports = { signup, signin };
