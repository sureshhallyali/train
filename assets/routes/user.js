const express = require("express");
const { signup, signin, user, forgotPass } = require("../controllers/userControllers");
const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.get("/user1", user);

router.post("/forgotPass", forgotPass);

module.exports = router; //exporting the module so it can be used in other files
