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
        let game = await db.Game.create({name: "New Untitled Game", gamemasters: [req.session.currentUser.id]}); 
        res.redirect(`/game/${game._id}/story`);
    }catch(err){
        return res.send(err);
    }
})

/* Games Join */
router.post("/join/:id", async function(req,res){
    try{
        console.log(req.params.id);
        let game = await db.Game.findByIdAndUpdate(req.body.gameId,{$push: {players: req.params.id}});
        return res.redirect(`/game/${game._id}/story`);
    }catch(err){
        return res.send(err);
    }
})

/* Games Component */
router.get("/games", async function(req,res){
    let gamemasterGames = await db.Game.find({gamemasters: {_id: req.session.currentUser.id}});
    let playerGames = await db.Game.find({players: {_id: req.session.currentUser.id}});
    console.log(playerGames);
    let games = [...gamemasterGames, ...playerGames];
    res.render("components/games",{games: games});
})

module.exports = router;