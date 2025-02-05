const express = require("express");
const router = express.Router()
const authControllers = require("../controllers/auth-contoller")


// @ENDPOINT http://localhost: 8000/api/register
router.post("/register",authControllers.register);
router.post("/login",authControllers.login);



//export
module.exports = router;