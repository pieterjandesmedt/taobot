var settings = {
	token: 'xoxb-22739892000-D2P2hTlYC8Wcq4YWPxxzDTdz',
	name: 'taobot'
};

var TaoBot = require('./taobot');
var taobot = new TaoBot(settings);

taobot.run();

//For avoiding Heroku $PORT error
var http = require('http');
http.createServer(function (req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});
	res.send('{ "message": "TaoBot is running" }');
}).listen(process.env.PORT || 5000);
