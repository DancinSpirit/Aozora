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
        newChapter = await db.Chapter.create({number: chapterNumber}); 
        foundgame = await db.Game.findByIdAndUpdate(req.params.id, {$push: {chapters: newChapter}});
        res.redirect(`/game/${foundGame._id}/story/${newChapter._id}`);
    }catch(err){
        console.log(err);
        return res.send(err);
    } 
})

/* Delete Story Chapter */
router.post("/:id/story/delete/:chapterNumber", async function(req, res){
    try{
        const game = await db.Game.findById(req.params.id).populate("chapters");
        game.chapters.splice(req.params.chapterNumber-1,1);
        for(let x=0; x<game.chapters.length; x++){
            await db.Chapter.findByIdAndUpdate(game.chapters[x]._id,{number: x+1})
        }
        console.log(game);
        await db.Game.findByIdAndUpdate(req.params.id,{chapters: game.chapters});
        res.redirect(`/game/${foundGame._id}/story`);
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

/* Delete Files */
router.post("/:id/files/:type/:name/delete", async function(req, res){
    try{
        if(req.params.type==="audio"){
            await db.Game.findByIdAndUpdate(req.params.id,{$pull: {songs:{name: req.params.name}} });
        }
        else if(req.params.type==="image"){
            await db.Game.findByIdAndUpdate(req.params.id,{$pull: {images:{name: req.params.name}} });
        }
        else{
            console.log("Something went terribly wrong on the server side delete files route.")
        }
        res.send("Success!");
    }catch(err){
        console.log(err);
        res.send(err);
    }
})

/* Upload Files*/
router.post("/:id/files", async function(req,res){
    if(file.size>10000000){
        console.log("FILE TOO BIG")
    }else{
        const file = req.files.file;
        console.log(file.size);
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
            console.log(file.mimetype.substring(0,5));
            if(file.mimetype.substring(0,5)==="image"){
                imageObject = {name: req.body.name, url: url};
                game = await db.Game.findByIdAndUpdate(req.params.id,{$push:{images: imageObject}})
                console.log(game);
            }else if(file.mimetype.substring(0,5)==="audio"){
                musicObject = {name: req.body.name, url: url};
                game = await db.Game.findByIdAndUpdate(req.params.id,{$push:{songs: musicObject}})
                console.log(game);
            }else{
                console.log("INVALID FILETYPE");
            }
        }catch(err){
            console.log("Error?");
            console.log(err)
        }
        res.redirect('back');
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
    let gamemaster = false;
    let player = false;
    for(let x=0; x<foundGame.gamemasters.length; x++){
        if(foundGame.gamemasters[x]==req.session.currentUser.id){
            gamemaster = true;
            player = true;
        }
    }
    for(let x=0; x<foundGame.players.length; x++){
        if(foundGame.players[x]==req.session.currentUser.id){
            player = true;
        }
    }
    if(player)
    res.render("story",{story: foundChapter, game: foundGame, gamemaster: gamemaster});
    res.redirect("/login");
})
/* Edit Story */
router.post("/:id/story/:storyId/edit/:index/:form", async function(req,res){
    try{
        let sentText = req.params.form.replace(/PERCENT-SIGN/g, '%');
        console.log(sentText);
        sentText = sentText.replace(/"/g,'&quot;').replace(/'/g,"&apos;").replace(/%/g, '&#37;');
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
        let sentText = req.params.form.replace(/PERCENT-SIGN/g, '%');
        sentText = sentText.replace(/"/g,'&quot;').replace(/'/g,"&apos;").replace(/%/g, '&#37;');
        await db.Chapter.findByIdAndUpdate(req.params.storyId,{$push: {story: sentText}})
        res.send(sentText);
    }catch(err){
        console.log(err);
    }
})

module.exports = router;