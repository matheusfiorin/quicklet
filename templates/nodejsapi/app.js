var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var compression = require("compression");

var mainRouter = require("./routes/index");

var cors = require("cors");

var app = express();

app.use(cors());
app.options("*", cors());

// view engine setup
app.set("views", path.join(__dirname, "routes/views"));
app.set("view engine", "jade");

app.use(bodyParser.json({
  limit: "50mb"
}));
app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: true
}));
app.use(compression());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.setTimeout(30000, function () {
    console.info("Request has timed out.");
    res.status(503).json({
      error: true,
      errorMessage: "Timed out."
    });
  });

  next();
});

app.use("/", mainRouter);

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

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, X-Auth-Token"
  );
  next();
});
app
  .listen(process.env.PORT, function () {
    console.info(`Server running on the port ${process.env.PORT}`);
  })
  .on("error", function (err) {
    console.info("on error handler");
    console.info(err);
  });

process.on("uncaughtException", function (err) {
  console.info("process.on handler");
  console.info(err);
});

module.exports = app;