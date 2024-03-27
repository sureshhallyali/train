const express = require("express");
const mysql = require("mysql");
const cors = require("cors"); 
const dotenv = require("dotenv");

const app = express();
app.use(cors()); 
app.use(express.json());

const userRoute = require("./routes/user");
const userModel = require("./controllers/userControllers");

app.use("/user", userRoute);
app.use(require("./routes/server"));

dotenv.config({ path: "./.env" });
const db = require('./db')

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

module.exports = db;