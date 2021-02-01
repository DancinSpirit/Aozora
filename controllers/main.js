const express = require('express');
const router = express.Router();
const db = require("../models");

/* Home Page */
router.get("/", async function(req,res){
    res.render("main");
})

module.exports = router;