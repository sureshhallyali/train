const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config({ path: "./.env" });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const userRoute = require("./routes/user");
const userModel = require("./controllers/userControllers");

app.use("/user", userRoute);
app.use(require("./routes/server"));
app.use(require("./routes/excel"));

const db = require("./db");

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

