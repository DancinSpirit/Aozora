const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    name: {type:String, required:true},
    gamemasters: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    players: [{user:{type: mongoose.Schema.Types.ObjectId, ref: "User"},character:{type: mongoose.Schema.Types.ObjectId, ref: "Character"}}],
    characters: [{type: mongoose.Schema.Types.ObjectId, ref: "Character"}],
    story: {type: mongoose.Schema.Types.ObjectId, ref: "Story"}
  },
  {timestamps: true}
)

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;