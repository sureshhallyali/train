const express = require("express");
const { signup, signin, user } = require("../controllers/userControllers");
const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.get("/user1", user);

module.exports = router; //exporting the module so it can be used in other files
