var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/:emotion", function (req, res, next) {
  // Get the emotion parameter from the URL
  const emotionParam = req.params.emotion;

  // Get the index.html file from the views folder
  res.render("chat.html", { emotion: emotionParam });
});

module.exports = router;
