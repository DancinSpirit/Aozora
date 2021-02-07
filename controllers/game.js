const express = require('express');
const router = express.Router();
const db = require("../models");

/* Game Story Route */
router.get("/:id/story", async function(req,res){
    const foundGame = await db.Game.findById(req.params.id);
    res.render("main",{sentState: "story"})
})
/* Game Character Route */
router.get("/:id/characters", async function(req,res){
    const foundGame = await db.Game.findById(req.params.id);
    res.render("main",{sentState: "characters"})
})
/* Game Player Route */
router.get("/:id/players", async function(req,res){
    const foundGame = await db.Game.findById(req.params.id);
    res.render("main",{sentState: "players"})
})
/* Game File Route */
router.get("/:id/files", async function(req,res){
    const foundGame = await db.Game.findById(req.params.id);
    res.render("main",{sentState: "files"})
})

/* Game Component: Story */
router.get("/:id/story/story", async function(req, res){
    res.render("components/game/story",{game: foundGame});
})
/* Game Component: Characters */
router.get("/:id/characters/characters", async function(req, res){
    res.render("components/game/characters");
})
/* Game Component: Players */
router.get("/:id/players/players", async function(req, res){
    res.render("components/game/players");
})
/* Game Component: Files */
router.get("/:id/files/files", async function(req, res){
    res.render("components/game/files");
})

module.exports = router;