var mongoose = require("mongoose")

var Schema = mongoose.Schema

var NewsSchema = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  url: {
    type: String
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "comments"
    }
  ]
})
var News = mongoose.model("News", NewsSchema)

module.exports = News
