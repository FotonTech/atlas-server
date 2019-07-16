const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Post", postSchema);
