const express = require("express");
const router = express.Router();
const { checkOut } = require("../Controller/checkOutController");

router.post("/", checkOut); 

module.exports = router;
