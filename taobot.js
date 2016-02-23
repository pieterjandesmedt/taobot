var util = require('util');
var path = require('path');
var fs = require('fs');

var Bot = require('slackbots');

var TaoBot = function Constructor(settings) {
	this.settings = settings;
	this.settings.name = this.settings.name || 'taobot';
	this.tao = require('./tao');
};

// inherits methods and properties from the Bot constructor
util.inherits(TaoBot, Bot);

TaoBot.prototype.run = function () {
	TaoBot.super_.call(this, this.settings);

	this.on('start', this._onStart);
	this.on('message', this._onMessage);
};

TaoBot.prototype._onStart = function () {
	this._loadBotUser();
	this._firstRunCheck();
};

TaoBot.prototype._onMessage = function (message) {
	// console.log('message ', message);
	if (this._isChatMessage(message) &&
		!this._isFromTaoBot(message) &&
		this._isMentioningTaoBot(message)
	) {
		this._replyWithTao(message);
	}
};

TaoBot.prototype._loadBotUser = function () {
	var self = this;
	this.user = this.users.filter(function (user) {
		return user.name.toLowerCase() === self.name.toLowerCase();
	})[0];
};

TaoBot.prototype._firstRunCheck = function () {
	var self = this;
	self._welcomeMessage();
};

TaoBot.prototype._welcomeMessage = function () {
	this.postMessageToUser('pieterjandesmedt', 'A well-written program is its own Heaven; a poorly-written program is its own Hell.', {
		as_user: true
	});
};

TaoBot.prototype._isChatMessage = function (message) {
	return message.type === 'message' && Boolean(message.text);
};

TaoBot.prototype._isChannelConversation = function (message) {
	return typeof message.channel === 'string' &&
		message.channel[0] === 'C';
};

TaoBot.prototype._isFromTaoBot = function (message) {
	return message.user === this.user.id;
};

TaoBot.prototype._isMentioningTaoBot = function (message) {
	return message.text.toLowerCase().indexOf('toabot') > -1 ||
		message.text.toLowerCase().indexOf('taobot') > -1 ||
		message.text.toLowerCase().indexOf(this.name) > -1 ||
		(message.text.toLowerCase().indexOf('tao') > -1 && message.text.toLowerCase().indexOf('programming') > -1);
};

TaoBot.prototype._replyWithTao = function (message) {
	var self = this;
	var str = message.text.toLowerCase();

	var matchingBook = /.*book (\d+?).*/ig.exec(str);
	if (!matchingBook) matchingBook = /.*(\d+?)\..*/ig.exec(str);
	var matchingChapter = /.*chapter (\d+?).*/ig.exec(str);
	if (!matchingChapter) matchingChapter = /.*\.(\d+?).*/ig.exec(str);

	console.log('matchingBook ' , matchingBook);
	console.log('matchingChapter ' , matchingChapter);

	matchingBook = matchingBook ? parseInt(matchingBook[1], 10) - 1 : -1;
	matchingChapter = matchingChapter ? parseInt(matchingChapter[1], 10) - 1 : -1;

	if (matchingBook < 0 || matchingBook >= self.tao.books.length - 1) matchingBook = Math.floor(Math.random() * (self.tao.books.length - 1));
	if (matchingChapter < 0 || matchingChapter >= self.tao.books[matchingBook].chapters.length) matchingChapter = Math.floor(Math.random() * self.tao.books[matchingBook].chapters.length);

	var story = this.tao.books[matchingBook].chapters[matchingChapter];
	story += '\n\n\n  -- _The Tao of Programming, Book ' + (matchingBook + 1) + ', Chapter ' + (matchingChapter + 1) + '_';

	if (self._isChannelConversation(message)) {
		var channel = self._getChannelById(message.channel);
		console.log('channel ', channel);
		self.postMessageToChannel(channel.name, story, {
			as_user: true
		});
	} else {
		var user = self._getUserById(message.user);
		self.postMessageToUser(user.name, story, {
			as_user: true
		});
	}
};

TaoBot.prototype._getChannelById = function (channelId) {
	return this.channels.filter(function (item) {
		return item.id === channelId;
	})[0];
};

TaoBot.prototype._getUserById = function (userId) {
	return this.users.filter(function (item) {
		return item.id === userId;
	})[0];
};

module.exports = TaoBot;
