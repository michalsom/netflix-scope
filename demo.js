var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var dataFile = require('./data.json');

app.set('port', process.env.PORT || 8080 );
app.set('view engine', 'ejs');

app.set('appData', dataFile);

app.locals.siteTitle='Netflix Scope';

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// app.use("/public", express.static(path.join(__dirname, 'public')));

app.use(require('./routes/index'));
app.use(require('./routes/movie'));

	

var server = app.listen(app.get('port'), () => {
	console.log('Listening port ' + app.get('port'));
});

