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
        res.send(game);
    }catch(err){
        return res.send(err);
    }
})

/* Games Delete */
router.post("/:id/delete", async function(req,res){
    try{
        let game = await db.Game.findByIdAndDelete(req.params.id);
        res.redirect("/games");
    }catch(err){
        console.log(err);
    }
})

/* Games Join */
router.post("/join/:id", async function(req,res){
    try{
        let game = await db.Game.findByIdAndUpdate(req.body.gameId,{$push: {players: req.params.id}});
        return res.send(game);
    }catch(err){
        return res.send(err);
    }
})

/* Games Component */
router.get("/games", async function(req,res){
    let gamemasterGames = await db.Game.find({gamemasters: {_id: req.session.currentUser.id}}).populate("gamemasters players");
    let playerGames = await db.Game.find({players: {_id: req.session.currentUser.id}}).populate("gamemasters players");
    let games = [...gamemasterGames, ...playerGames];
    res.render("components/games",{games: games});
})

module.exports = router;