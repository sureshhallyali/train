const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const dotenv = require("dotenv");

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
      return res.status(201).json({user:existingUser, token:token, message: "Logged In successfully" });
    }
  );
};


// jwt token verification & getting data fromat for user
const user = async (req, res) =>{
  const token=req.header("authorization");

  if(!token){
    return res
    .status(401)
    .json({message: "Unauthorized HTTP, Token not provided"});
  }

console.log(" Try block started ------------------------------------------------------------------------------>");

  try {
    //Verify the token
  const jwtToken = token.replace("Bearer ", "").trim();  // Fix Token Parsing  
    console.log(jwtToken);
    
    const decode = jwt.verify(jwtToken, secreteKey);
    console.log(decode);

    console.log("one line after The Try block  2------------------------------------------------------------------------------>");
    // Retrieve the user from the database using mobile number in the secod token

    db.query(
      "SELECT * FROM users WHERE mobile  =?",
      [decode.mobile],
      (err, results) => {
          if(err){
            console.log(err);
            return res.status(500).json({message:"Internal server error"});
          }

          if(results.length !== 1){
            return res.status(400).json({message:"The user does not exist."});
          }

            const user = results[0];
            
            console.log(`This is my user :--> ${user}`);
            // Check if the token from the database matches the token from the frontend

            if(user.token !== token){
              return res.status(401).json({message:"Unauthorized, Token Mismatch"});
            }

             //   t oken is valid and matches the token stored in the database
             return res.status(200).json({message:"Token Is Valid, You can access the data"}) ;
      }
    ); 
  }catch (error) {
    console.log(error);
    return res.status(401).json({message:"Unauthorised, Invalid Token   (IN CATCH BLOCK)"})
  }
};


module.exports = { signup, signin, user};
