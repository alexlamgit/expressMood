var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/:emoji", function (req, res, next) {
  const emoji = req.params.emoji;
  // Get the index.html file from the views folder
  res.render("chat.html", { emoji: emoji });
});

module.exports = router;
