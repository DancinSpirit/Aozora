const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    chapter: {type:Number, required:true},
    story: [String],
    songs: [{name: String, url: String}],
    images: [{name: String, url: String}]
  },
  {timestamps: true}
)

const Story = mongoose.model("Story", storySchema);

module.exports = Story;