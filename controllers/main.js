const express = require('express');
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcryptjs");

/* Home Page */
router.get("/", async function(req,res){
    res.render("main");
})

/* Register */
router.post("/register", async function(req,res){
    try{
        const foundUser = await db.User.findOne({username: req.body.username});
        if(foundUser) return res.send("This username already exists!");
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        const newUser = await db.User.create(req.body);
        console.log(newUser);
        return res.send("Registration Successful!");
    }catch(err){
        console.log(err);
        return res.send(err);
    }    
});

module.exports = router;