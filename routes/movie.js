var express = require('express');
var router = express.Router();
var axios = require('axios');
var fs = require('fs');

const omdbKey = "974aedde";
const unogsKey = '180e1da451mshc085149b2a69db8p1a9cf2jsnb1b6dec955bc';

var nameFile = "counter.json";
var file = require("../counter.json");
var schedule = require('node-schedule');

 
var j = schedule.scheduleJob('59 2 * * *', function(){
  file.counter = 0;
  fs.writeFile(nameFile, JSON.stringify(file), function (err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(file));
  });
});

router.get('/movie/:id', function(req,res){	
  var currentMovie;
  axios.get('https://www.omdbapi.com?i='+req.params.id+'&apikey='+omdbKey+'&Z&plot=full')
    .then((response)=>{
      currentMovie = response.data;
      res.render('movie',{
        pageTitle:'Movie', 
        pageID:'movie',
        msg:'',
        moviePage: currentMovie
      });
    })
    .catch((error)=>{
      console.log(error)
    })   
});

router.post('/movie/send',(req,res)=>{
    if (file.counter < 99){
    axios({
        "method":"GET",
        "url":"https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi",
        "headers":{
        "content-type":"application/octet-stream",
        "x-rapidapi-host":"unogs-unogs-v1.p.rapidapi.com",
        "x-rapidapi-key":unogsKey
        },"params":{
        "t":"loadvideo",
        "q":req.body.netID
        }
        })
        .then((response)=>{
          fs.readFile("counter.json", (err, data) => {
            if (err) throw err;
            let clicks = JSON.parse(data);
            currentClicks = clicks.counter;
            file.counter = currentClicks + 1;
          
            fs.writeFile('counter.json', JSON.stringify(file), function (err) {
              if (err) return console.log(err);
            });
          });
          res.send(response.data);
        })
        .catch((error)=>{
          console.log(error)
        })
      }
});

module.exports = router;