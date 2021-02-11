const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    chapter: {type:Number, required:true},
    story: [String],
    name: {type:String},
    summary: {type:String}
  },
  {timestamps: true}
)

const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = Chapter;