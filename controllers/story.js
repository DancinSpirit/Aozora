const express = require('express');
const router = express.Router();
const db = require("../models");

router.get("/:id", async function(req, res){
    const foundStory = await db.Story.findById(req.params.id);
    res.render("story",{story: foundStory});
})

module.exports = router;