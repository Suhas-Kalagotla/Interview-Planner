
const mongoose = require("mongoose");

// TODO : 
var chatSchema = new mongoose.Schema(
  {
   

  },
  { timestamps: true } 
);


module.exports = mongoose.model("chat", chatSchema);