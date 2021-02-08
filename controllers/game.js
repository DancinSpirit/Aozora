const express = require('express');
const router = express.Router();
const db = require("../models");

/* Game Story Route */
router.get("/:id/story", async function(req,res){
    const foundGame = await db.Game.findById(req.params.id);
    res.render("main",{sentState: "story", game: foundGame})
})
/* Game Character Route */
router.get("/:id/characters", async function(req,res){
    const foundGame = await db.Game.findById(req.params.id);
    res.render("main",{sentState: "characters", game: foundGame})
})
/* Game Player Route */
router.get("/:id/players", async function(req,res){
    const foundGame = await db.Game.findById(req.params.id);
    res.render("main",{sentState: "players", game: foundGame})
})
/* Game File Route */
router.get("/:id/files", async function(req,res){
    const foundGame = await db.Game.findById(req.params.id);
    res.render("main",{sentState: "files", game: foundGame})
})

/* Create Story Chapter */
router.post("/:id/story/create", async function(req, res){
    try{
        foundGame = await db.Game.findById(req.params.id);
        chapterNumber = foundGame.chapters.length + 1;
        newChapter = await db.Chapter.create({chapter: chapterNumber}); 
        foundgame = await db.Game.findByIdAndUpdate(req.params.id, {$push: {chapters: newChapter}});
        res.redirect(`/game/${foundGame._id}/story/${newChapter._id}`);
    }catch(err){
        console.log(err);
        return res.send(err);
    } 
})

/* Game Component: Story */
router.get("/:id/story/story", async function(req, res){
    foundGame = await db.Game.findById(req.params.id).populate("chapters");
    res.render("components/game/story",{stories: foundGame.chapters, game:foundGame});
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

router.post("/:id/name", async function(req, res){
    await db.Game.findByIdAndUpdate(req.params.id,{"name":req.body.name});
    res.send("Name Change Success!");
})


/* Story View */
router.get("/:id/story/:storyId", async function(req, res){
    const foundChapter = await db.Chapter.findById(req.params.storyId);
    const foundGame = await db.Game.findById(req.params.id);
    res.render("story",{story: foundChapter, game: foundGame});
})
router.post("/:id/story/:storyId/:form", async function(req,res){
    try{
        await db.Chapter.findByIdAndUpdate(req.params.storyId,{$push: {story: req.params.form}})
        res.send(req.params.form);
    }catch(err){
        console.log(err);
    }
})

module.exports = router;