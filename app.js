var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var njk = require("nunjucks");
var dotenv = require("dotenv").config();
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dashboardRouter = require("./routes/dashboard");
var sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.sqlite");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS mood_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      emoji TEXT NOT NULL,
      meter REAL NOT NULL,
      volume REAL NOT NULL
    )
  `);
  // const stmt = db.prepare(
  //   "INSERT INTO table_name (emoji, meter, volume) VALUES (?, ?, ?)"
  // );
  // stmt.run(["some string", 100, 1]);
  // stmt.run(["another string", 200, 1]);
  // stmt.finalize();

  db.close();
});

var app = express();

// "view" engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

njk.configure("views", {
  autoescape: true,
  express: app,
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/dashboard", dashboardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
