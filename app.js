const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());

const userRoute = require("./assets/routes/user");
const userModel = require("./assets/controllers/userControllers");



app.use("/user",require('./assets/routes/user'));

dotenv.config({ path: "./.env" });

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("mysql Connected");
  }
});

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
