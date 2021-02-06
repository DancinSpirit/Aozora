const express = require("express");
const methodOverride = require("method-override");
const session = require('express-session');
const fileUpload = require('express-fileupload');
const MongoStore = require('connect-mongo')(session);

const ctrl = require("./controllers");

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
require("dotenv").config()

const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(fileUpload({
    createParentPath: true
}));

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

app.use(async function(req,res,next){
    app.locals.user = req.session.currentUser;
    next();
}) 

app.use("/games", ctrl.games);
app.use("/profile", ctrl.profile);
app.post("/logout", function(req,res){
    req.session.destroy();
    return res.send("Logged Out");
})

app.use("/", ctrl.main);

io.on('connection', (socket) => {
    console.log('Connected.');
});

http.listen(PORT, function(){
    console.log(`Live at http://localhost:${PORT}/`);
})