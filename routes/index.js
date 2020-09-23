var express = require('express');
var router = express.Router();
var axios = require('axios');
var fs = require('fs');

var nameFile = "counter.json";
var file = require("../counter.json");

var unogsngKey = "your unogsng API key";

router.get('/', (req, res) => {
	var data = req.app.get('appData');
	var countries = data.countries;

	res.render('index', {
		pageTitle: 'Netflix Scope',
		pageID: 'index',
		countries: countries,
		msg: ''
	});

	router.post('/searchTitles', (req, res) => {
		fs.readFile("counter.json", (err, data) => {
			if (err) throw err;
			let clicks = JSON.parse(data);
			currentClicks = clicks.counter1;
			if (currentClicks > 96){
				console.log('limit reached')
				return
			}
		axios({
			"method":"GET",
			"url":"https://unogsng.p.rapidapi.com/search",
			"headers":{
			"content-type":"application/octet-stream",
			"x-rapidapi-host":"unogsng.p.rapidapi.com",
			"x-rapidapi-key":unogsngKey,
			"useQueryString":true
			},"params":{
			"query":req.body.currentSearch,
			"limit":"40",
			"offset": 40 * req.body.page
			}
			})	
		.then((response) => {
			fs.readFile("counter.json", (err, data) => {
				if (err) throw err;
				let clicks = JSON.parse(data);
				currentClicks = clicks.counter1;
				file.counter1 = currentClicks + 1;
				fs.writeFile(nameFile, JSON.stringify(file), function (err) {
					if (err) return console.log(err);
					console.log(file)
				});
			});
				res.send(response.data);
			})
			.catch((error) => {
				console.log(error)
			})
	});
	});
	router.post('/searchPeople', (req, res) => {
		fs.readFile("counter.json", (err, data) => {
			if (err) throw err;
			let clicks = JSON.parse(data);
			currentClicks = clicks.counter1;
			if (currentClicks > 96){
				console.log('limit reached')
				return
			}
		axios({
			"method":"GET",
			"url":"https://unogsng.p.rapidapi.com/people",
			"headers":{
			"content-type":"application/octet-stream",
			"x-rapidapi-host":"unogsng.p.rapidapi.com",
			"x-rapidapi-key":unogsngKey,
			"useQueryString":true
			},"params":{
			"name":req.body.currentSearch,
			"limit": "40",
			"offset": 40 * req.body.page
			}
			})	
		.then((response) => {
			fs.readFile("counter.json", (err, data) => {
				if (err) throw err;
				let clicks = JSON.parse(data);
				currentClicks = clicks.counter1;
				file.counter1 = currentClicks + 1;
				fs.writeFile(nameFile, JSON.stringify(file), function (err) {
					if (err) return console.log(err);
					console.log(file)
				});
			});
			res.send(response.data)
			})
			.catch((error) => {
				console.log(error)
			})
		});
	});

});
module.exports = router;