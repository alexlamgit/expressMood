var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // Get the index.html file from the views folder
  res.render("index.html", { name: "Alex" });
});

module.exports = router;
