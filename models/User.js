const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    avatar: {type: String},
    fullname: {type: String},
    bio: {type: String}
  },
  {timestamps: true}
)

const User = mongoose.model("User", userSchema);

module.exports = User;