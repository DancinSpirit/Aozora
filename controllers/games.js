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

/* Games Create */
router.post("/create", async function(req,res){
    try{
        db.Game.create({name: "New Untitled Game", gamemasters: [req.session.currentUser.id]}); 
        /* Will need to send game id somehow */
        res.redirect("/game");
    }catch(err){
        return res.send(err);
    }
})

/* Games Show */
router.get("/games", async function(req,res){
    let gamemasterGames = await db.Game.find({gamemasters: {_id: req.session.currentUser.id}});
    let playerGames = await db.Game.find({players: {_id: req.session.currentUser.id}});
    let games = [...gamemasterGames, ...playerGames];
    res.render("games",{games: games});
})

module.exports = router;