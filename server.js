var express = require("express")
var mongoose = require("mongoose")
var cheerio = require("cheerio")
var axios = require("axios")

var db = require("./models")

var PORT = 3000

var app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static("public"))
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/newscraperdb"

mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true }
)
//Route to scrape the news website
app.get("/scrape", function(req, res) {
  axios
    .get("https://www.jornada.com.mx/ultimas/cultura/")
    .then(function(response) {
      var $ = cheerio.load(response.data)
      let results = []
      $("div.ljn-row-listado-item").each(function(i, element) {
        let result = {}
        result.title = $(this)
          .find("h2")
          .find("a")
          .text()
        result.description = $(this)
          .find("p")
          .text()
        result.url = $(this)
          .find("h2")
          .find("a")
          .attr("href")
        //res.json(result)
        results.push(result)
      })
      db.News.insertMany(results, (err, docs) => {
        if (err) {
          console.log(err)
        }
      })
      res.json(results)
    })
})
//Find all the news in the database
app.get("/news", function(req, res) {
  db.News.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle)
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err)
    })
})
app.get("/news/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.News.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("comments")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle)
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err)
    })
})
app.post("/news/:id", function(req, res) {
  db.Comments.create(req.body)
    .then(function(dbComment) {
      //console.log(db.News.findOne({ _id: req.params.id }).comments)
      return db.News.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comments: dbComment._id } },
        { new: true }
      )
    })
    .then(function(data) {
      res.json(data)
    })
    .catch(function(err) {
      res.json(err)
    })
})
app.get("/delete/:id", function(req, res) {
  db.Comments.remove({ _id: req.params.id }, function(error, removed) {
    if (error) {
      res.send(error)
    } else {
      res.send(removed)
    }
  })
})

app.listen(PORT, function() {
  console.log("App listening on port " + PORT)
})
