const express = require("express");
const { signup, signin, generate_excel } = require("../controllers/userControllers");
const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.get("/generate_excel", generate_excel);

module.exports = router; //exporting the module so it can be used in other files
