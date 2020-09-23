var express = require('express');
var router = express.Router();
var axios = require('axios');
var fs = require('fs');

const unogsKey = "your unogs API key";

var nameFile = "counter.json";
var file = require("../counter.json");
var schedule = require('node-schedule');

var j = schedule.scheduleJob('59 2 * * *', function () {
  file.counter1 = file.counter2 = 0;
  fs.writeFile(nameFile, JSON.stringify(file), function (err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(file));
  });
});

router.get('/movie/:id/:title', function (req, res) {
  res.render('movie', {
    pageTitle: 'Netflix Scope: ' + req.params.title,
    pageID: 'movie',
    msg: '',
    movieID: req.params.id,
    movieTitle: req.params.title
  });
});

router.post('/movie/get/:id', function (req, res) {
  axios({
    "method": "GET",
    "url": "https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi",
    "headers": {
      "content-type": "application/octet-stream",
      "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com",
      "x-rapidapi-key": unogsKey,
      "useQueryString": true
    }, "params": {
      "t": "loadvideo",
      "q": req.params.id
    }
  }).then((response) => {
    fs.readFile("counter.json", (err, data) => {
      if (err) throw err;
      let clicks = JSON.parse(data);
      currentClicks = clicks.counter2;
      file.counter2 = currentClicks + 1;
      fs.writeFile('counter.json', JSON.stringify(file), function (err) {
        if (err) return console.log(err);
        console.log(file)
      });
    });

    res.send(response.data.RESULT)
  })
    .catch((error) => {
      console.log(error)
    })
});

module.exports = router;