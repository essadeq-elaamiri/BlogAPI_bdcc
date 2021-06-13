var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var articlesRouter = require("./routes/articles");
var tagsRouter = require("./routes/tags");
var commentsRouter = require("./routes/comments");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/articles", articlesRouter);
app.use("/tags", tagsRouter);
app.use("/comments", commentsRouter);

app.all("*", function (req, res, next) {
  res.redirect("/");
  next(); // pass control to the next handler
});

module.exports = app;
