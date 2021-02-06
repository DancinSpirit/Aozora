const express = require('express');
const router = express.Router();
const db = require("../models");

/* Games Route */
router.get("/", async function(req, res){
    try{
        res.render("main",{sentState: "games"});
    }catch(err){
        return res.send(err);
    }
})

router.post("/create", async function(req,res){
    try{
        db.Game.create({name: "New Untitled Game", gamemasters: [req.session.currentUser._id]});
        /* Will need to send game id somehow */
        res.redirect("/game");
    }catch(err){
        return res.send(err);
    }
})

module.exports = router;