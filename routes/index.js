var express = require('express');
var router = express.Router();
var axios = require('axios');

var omdbKey = "your OMDb key";

router.get('/', (req,res) => {	
	var data = req.app.get('appData');
	var countries = data.countries;

    res.render('index',{
        pageTitle:'Netflix Scope',     
		pageID:'index',
		countries: countries,
        msg:''
    });
		
		router.post('/send',(req,res)=>{
       
			axios.get('https://www.omdbapi.com/?s='+req.body.currentSearch+'&apikey='+omdbKey+'&Z&'+ req.body.filter +'&page='+req.body.page )
			.then((response) => {
				res.send(response.data);
			})
					.catch((error)=>{
						console.log(error)
					})
	
	});

});
module.exports = router;