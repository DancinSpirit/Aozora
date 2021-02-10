const express = require('express');
const router = express.Router();
const db = require("../models");
const s3 = require("../s3.js");

/* User Profile Route */
router.get("/", async function(req,res){
  res.render("main", {sentState: "account"})
})

/* Profile Component (Current User)*/
router.get("/info", async function(req,res){
  res.render("components/profile");
})

/* Profile Component (Get User By ID) */
router.get("/info/:id", async function(req,res){
  const user = await db.Player.findById(req.params.id);
  res.render("profile", {user: user});
})

/* Upload Avatar */
router.post("/avatar/:id", async function(req,res){
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
    user = await db.User.findByIdAndUpdate(req.params.id,{avatar: url});
  }catch(err){
    console.log("Error?");
    console.log(err)
  }

  res.redirect('back');
})

module.exports = router;