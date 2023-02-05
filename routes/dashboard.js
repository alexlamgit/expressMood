var express = require("express");
var router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

// Create a new OpenAI API client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/* GET dashboard page. */
router.post("/", async function (req, res) {
  //Set the data variable to the POST request as a string
  data = JSON.stringify(req.body.moodString);
  // Get the index.jade file from the views folder
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    temperature: 0.8,
    max_tokens: 32,
    prompt: `The answer will contain three elements seperated by a pipe operator. The first elelment will convert the sentence to a unicode emoji. The second element will be a numerical value representing happinness level on a scale of 0 to 100 inclusively. The third element will be a customized quote 5 to 10 words long. Sentence: ${data}`,
  });
  let completionText = completion.data.choices[0].text;
  let completionTextArray = completionText.split("|");

  console.log(completionTextArray);

  res.render("dashboard.html", {
    //remove all spaces from the string
    happinessEmoji: completionTextArray[0].replace(/\s/g, ""),
    happinessLevel: completionTextArray[1].replace(/\s/g, ""),
    greeting: completionTextArray[2],
  });
});

router.get("/", function (req, res, next) {
  // Get the dashboard.html file from the views folder
  data = "GET request";
  res.render("dashboard.html", { data: data });
});

module.exports = router;
