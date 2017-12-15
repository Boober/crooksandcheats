var express = require('express');
var fs = require('fs');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();


var jsonParser = bodyParser.json();

app.set('views',__dirname + "/views");
app.set('view engine', 'ejs');

app.use(morgan('tiny'));


app.use(bodyParser.urlencoded({ extended: true}));

fs.readdirSync('./routes').forEach(function (file) {
	console.log("Got here");
	if (path.basename(file) != 'serverSocket.js')
	{
		if (path.extname(file) == '.js') {
			require('./routes/' + file).init(app);
		}	
	}
});
//require('./routes/monsters.js').init(app);

//Setup index page route.

index = function(req,res)
{
	res.render('lobby/index', {title: 'Getting Started'});
}

app.get('/', index);

app.get('/lobby', function (req, res) {
	res.render('lobby/lobby');
});

app.get('/game/game', function (req, res) {
	res.render('game/game');
});

app.get('/start', function (req,res) {
	res.render('lobby/start');
});

app.post('/game/challenge', jsonParser, function (req,res) {
	console.log("Got here.");
	console.log(req.body);
	res.render('game/challenge', { encounter: req.body.name, options: req.body.list}, function(err, html) {
		console.log(html);
		res.send(html);
	});
});


app.use(express.static(__dirname + "/public"));


var httpServer = require('http').createServer(app);

var sio = require('socket.io')(httpServer);
//var io = sio(httpServer);

httpServer.listen(50001,function()
	{
		console.log("Server listenining at http://localhost:50001");
	});


var gameSockets = require('./routes/serverSocket.js');
gameSockets.init(sio);