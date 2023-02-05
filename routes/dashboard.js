var express = require("express");
var router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const sqlite3 = require("sqlite3").verbose();

// Create a new OpenAI API client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function checkStringInDB(dbPath, string, callback) {
  const db = new sqlite3.Database(dbPath);
  db.serialize(() => {
    db.get(`SELECT * FROM mood_data WHERE emoji = ?`, [string], (err, row) => {
      if (err) {
        return console.error(err.message);
      } else if (callback) {
        db.close();
        callback(row);
      }
    });
  });
}

function insertStringInDB(dbPath, emoji, emotion, meter) {
  const db = new sqlite3.Database(dbPath);
  db.serialize(() => {
    db.run(
      `INSERT INTO mood_data (emoji, emotion, meter, volume) VALUES (?, ?, ?, ?)`,
      [emoji, emotion, meter, 1],
      (err) => {
        if (err) {
          return console.error(err.message);
        }
      }
    );
  });
  db.close();
}

function incrementVolumeInDB(dbPath, string) {
  const db = new sqlite3.Database(dbPath);
  db.serialize(() => {
    db.run(
      `UPDATE mood_data SET volume = volume + 1 WHERE emoji = ?`,
      [string],
      (err) => {
        if (err) {
          return console.error(err.message);
        }
      }
    );
  });
  db.close();
}

/* GET dashboard page. */
router.post("/", async function (req, res) {
  //Set the data variable to the POST request as a string
  data = JSON.stringify(req.body.moodString);
  // Get the index.jade file from the views folder
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    temperature: 0.8,
    max_tokens: 32,
    prompt: `The answer will contain four elements seperated by a pipe operator. The first elelment will convert the sentence to a unicode emoji. The second element will be the main emtion conveyed in the text. The third element will be a numerical value representing happinness level on a scale of 0 to 100 inclusively. The fourth element will be a customized quote 5 to 10 words long. Sentence: ${data}`,
  });
  let completionText = completion.data.choices[0].text;
  let completionTextArray = completionText.split("|");
  console.log(completionTextArray);
  let emoji = completionTextArray[0].replace(/\s/g, "");
  let emotion = completionTextArray[1].replace(/\s/g, "");
  let happiness = completionTextArray[2].replace(/\s/g, "");
  let quote = completionTextArray[3];

  checkStringInDB("database.sqlite", emoji, function (row) {
    if (row != undefined) {
      console.log("String already exists in database\n");
      incrementVolumeInDB("database.sqlite", emoji);
    } else {
      console.log("String does not exist in database\n");
      insertStringInDB("database.sqlite", emoji, emotion, happiness);
    }
  });

  res.render("dashboard.html", {
    //remove all spaces from the string
    happinessEmoji: emoji,
    emotion: emotion,
    happinessLevel: happiness,
    greeting: quote,
  });
});

router.get("/", function (req, res, next) {
  // Get the dashboard.html file from the views folder
  data = "GET request";
  res.render("dashboard.html", { data: data });
});

module.exports = router;
