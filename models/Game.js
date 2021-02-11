const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    name: {type:String, required:true},
    gamemasters: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    players: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    characters: [{type: mongoose.Schema.Types.ObjectId, ref: "Character"}],
    chapters: [{type: mongoose.Schema.Types.ObjectId, ref: "Chapter"}],
    songs: [{name: {type:String, unique:true}, url: {type:String}}],
    images: [{name: {type:String, unique:true}, url: {type:String}}]
  },
  {timestamps: true}
)

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;