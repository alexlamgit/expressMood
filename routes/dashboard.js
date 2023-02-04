var express = require("express");
var router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

// Create a new OpenAI API client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/* GET dashboard page. */
router.post("/", function (req, res) {
  //Set the data variable to the POST request as a string
  data = JSON.stringify(req.body.moodString);
  // Get the index.jade file from the views folder
  console.log("POST request");
  res.render("dashboard.html", { data: data });
});

router.get("/", function (req, res, next) {
  // Get the dashboard.html file from the views folder
  data = "GET request";
  res.render("dashboard.html", { data: data });
});

module.exports = router;
