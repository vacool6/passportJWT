const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  username: String,
  password: String,
  tokens: [{ type: Object }],
});

module.exports = mongoose.model("User", userSchema);
