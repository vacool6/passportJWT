const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  username: String,
  password: String,
  token: { type: Object },
});

module.exports = mongoose.model("User", userSchema);
