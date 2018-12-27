var mongoose = require("mongoose")

var Schema = mongoose.Schema

var CommentSchema = new Schema({
  comment: String
})

var Comments = mongoose.model("comments", CommentSchema)

module.exports = Comments
