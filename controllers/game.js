const express = require('express');
const router = express.Router();
const db = require("../models");
const s3 = require('../s3.js');

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

/* Upload Music */
router.post("/:id/music", async function(req,res){
    console.log(req.body.name);
    const file = req.files.file;
    let filename = `${Date.now()}-${file.name}`;
    let url = `https://aozora.s3.us-east-2.amazonaws.com/${filename}`
    const params = {
      Bucket: "aozora",
      Key: filename,
      Body: Buffer.from(file.data, 'binary')
    }
  
    s3.upload(params, function(err, data){
      if(err){
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
    })

    try{
        musicObject = {name: req.body.name, url: url};
        game = await db.Game.findByIdAndUpdate(req.params.id,{$push:{songs: musicObject}})
        console.log(game);
    }catch(err){
        console.log("Error?");
        console.log(err)
    }
    res.redirect('back');
})

/* Upload Images*/
router.post("/:id/images", async function(req,res){
    const file = req.files.file;
    let filename = `${Date.now()}-${file.name}`;
    let url = `https://aozora.s3.us-east-2.amazonaws.com/${filename}`
    const params = {
      Bucket: "aozora",
      Key: filename,
      Body: Buffer.from(file.data, 'binary')
    }
  
    s3.upload(params, async function(err, data){
      if(err){
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
    })

    try{
        imageObject = {name: req.body.name, url: url};
        game = await db.Game.findByIdAndUpdate(req.params.id,{$push:{images: imageObject}})
        console.log(game);
    }catch(err){
        console.log("Error?");
        console.log(err)
    }
    res.redirect('back');
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
    foundGame = await db.Game.findById(req.params.id).populate("gamemasters").populate("players");
    res.render("components/game/players",{game:foundGame});
})
/* Game Component: Files */
router.get("/:id/files/files", async function(req, res){
    foundGame = await db.Game.findById(req.params.id).populate("chapters");
    res.render("components/game/files",{game:foundGame});
})

router.post("/:id/name", async function(req, res){
    await db.Game.findByIdAndUpdate(req.params.id,{"name":req.body.name});
    res.send(req.body.name);
})


/* Story View */
router.get("/:id/story/:storyId", async function(req, res){
    const foundChapter = await db.Chapter.findById(req.params.storyId);
    const foundGame = await db.Game.findById(req.params.id);
    res.render("story",{story: foundChapter, game: foundGame});
})
/* Edit Story */
router.post("/:id/story/:storyId/edit/:index/:form", async function(req,res){
    try{
        let sentText = req.params.form;
        sentText = sentText.replace(/"/g,'&quot;').replace(/'/g,"&apos;")
        let story = await db.Chapter.findById(req.params.storyId);
        let array = story.story;
        array[req.params.index] = sentText;
        await db.Chapter.findByIdAndUpdate(req.params.storyId, {story: array});
        res.send(sentText);

    }catch(err){
        console.log(err);
    }
})
/* Delete Story */
router.post("/:id/story/:storyId/delete/:index/", async function(req,res){
    try{
        let story = await db.Chapter.findById(req.params.storyId);
        array = story.story;
        array.splice(req.params.index, 1);
        console.log(array)
        await db.Chapter.findByIdAndUpdate(req.params.storyId, {story: array});
        res.send(req.params.form);

    }catch(err){
        console.log(err);
    }
})
/* Add to Story */
router.post("/:id/story/:storyId/:form", async function(req,res){
    try{
        let sentText = req.params.form;
        sentText = sentText.replace(/"/g,'&quot;').replace(/'/g,"&apos;")
        await db.Chapter.findByIdAndUpdate(req.params.storyId,{$push: {story: sentText}})
        res.send(sentText);
    }catch(err){
        console.log(err);
    }
})

module.exports = router;