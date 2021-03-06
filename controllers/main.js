const express = require('express');
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcryptjs");

/* Home Page */
router.get("/", async function(req,res){
    if(req.session.currentUser){
        res.render("main",{sentState: "home-games"});
    }else{
        res.render("main",{sentState: "home-login"});
    }
})

/* Register */
router.post("/register", async function(req,res){
    try{
        const foundUser = await db.User.findOne({username: req.body.username});
        if(foundUser) return res.send("This username already exists!");
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        req.body.avatar = "/images/avatar_placeholder.png";
        req.body.bio = "";
        req.body.fullname = "";
        const newUser = await db.User.create(req.body);
        req.session.currentUser = {
            id: newUser._id,
            username: newUser.username,
            avatar: newUser.avatar,
            bio: newUser.bio,
            fullname: newUser.fullname
        }
        return res.send("Registration Successful!");
    }catch(err){
        console.log(err);
        return res.send(err);
    }    
});

/* Login */
router.post("/login", async function(req,res){
    try{
        const foundUser = await db.User.findOne({username: req.body.username});
        if(!foundUser) return res.send({displayText: "That username doesn't exist!"})
        const match = await bcrypt.compare(req.body.password, foundUser.password);
        if(!match) return res.send({displayText: "Password Invalid"});
        req.session.currentUser = {
            id: foundUser._id,
            username: foundUser.username,
            avatar: foundUser.avatar,
            bio: foundUser.bio,
            fullname: foundUser.fullname
        }
        return res.send("Login Successful!");
    }catch(err){
        return res.send(err);
    }    
})

/* Login Page */
router.get("/login", async function(req, res){
    try{
        res.render("main",{sentState: "login"});
    }catch(err){
        return res.send(err);
    }
})

/* Register Page */
router.get("/register", async function(req, res){
    try{
        res.render("main",{sentState: "register"});
    }catch(err){
        return res.send(err);
    }
})

module.exports = router;