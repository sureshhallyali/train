const express = require("express");
const { signup, signin } = require("../controllers/userControllers");
const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

module.exports = router; //exporting the module so it can be used in other files
