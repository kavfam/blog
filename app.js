//jshint esversion:6

const cl = (...args) => console.log(...args);
// use dotenv to access your .env file
require("dotenv").config();
const srvr = process.env.N1_KEY;
const srvrCred = process.env.N1_SECRET;

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent =
  "Home Starting Content.  Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. ";
const aboutContent =
  "About Content. Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. ";
const contactContent =
  "Contact Content. Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//import mongoose module
const mongoose = require("mongoose");
const { overArgs } = require("lodash");

//set up default mongoose connection (this will connect to or create databse if it doesnt exist)
const myDB = "blogDB"; // default database
//const mongoDB = "mongodb://localhost:27017/" + myDB;
const mongoDB =
  "mongodb+srv://" +
  srvr +
  ":" +
  srvrCred +
  "@cluster0.57qzj.mongodb.net/" +
  myDB;
cl(mongoDB);

mongoose.connect(mongoDB, { useNewUrlParser: true });

//get the default connecton
const db = mongoose.connection;

//bind connection to error event to get notification of connection errors
db.on("error", console.error.bind(console, "MongoDB connection error"));

// Next step is to create schema / model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});
//Content-Type: application/html
// model must specify singular name of collection, schema
const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  // need to find and render all posts, prev using array but now need documents from db
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("aboutus", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
    });
  });
});

// app.listen(3000, function () {
//   console.log("Server started on port 3000");
// });

app.listen(process.env.PORT || 3000, function () {
  cl("Server started at port 3000");
});
