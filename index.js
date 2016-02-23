var settings = {
    token: 'xoxb-22739892000-D2P2hTlYC8Wcq4YWPxxzDTdz',
    name: 'taobot'
};

var TaoBot = require('./taobot');
var taobot = new TaoBot(settings);

taobot.run();
