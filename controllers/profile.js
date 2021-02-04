const express = require('express');
const router = express.Router();
const db = require("../models");

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
let bucket; 
// Call S3 to list the buckets
s3.listBuckets(function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Buckets);
    bucket = data.Buckets[0];
  }
});

/* Profile Page (Current User)*/
router.get("/", async function(req,res){
    res.render("profile", {user: req.session.currentUser});
})

/* Profile Page (Get User By ID) */
router.get("/:id", async function(req,res){
    const user = await db.Player.findById(req.params.id);
    res.render("profile", {user: user});
})

module.exports = router;