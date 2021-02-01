const express = require("express");
const methodOverride = require("method-override");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const ctrl = require("./controllers");

const app = express();
require("dotenv").config()

const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.use(session({
    store: new MongoStore({
        url: process.env.MONGODB_URI
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 1
    }  
}));

app.use(function(req,res,next){
    /* Load Variables Here */
    next();
}) 

app.use("/", ctrl.main);

app.listen(PORT, function(){
    console.log(`Live at http://localhost:${PORT}/`);
})