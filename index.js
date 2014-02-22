var twit = require("twit");
var gpio = require("pi-gpio");

var t = new twit({
	consumer_key: '',
	consumer_secret: '',
	access_token: '',
	access_token_secret: ''
});

var gpio_pin = 22;

var lastTweet = {id: 0};



function ringTheBell() {
	gpio.open(gpio_pin, "output", function(err) {
		gpio.write(gpio_pin, 1, function() {
			setTimeout(function() {
				gpio.write(gpio_pin, 0, function() {
					gpio.close(gpio_pin);
				});
			}, 100);
		});
	});
}

function processTweets(err, reply) {
	if (reply.statuses.length > 0) {
		if (reply.statuses[0].id > lastTweet.id) {
			lastTweet = reply.statuses[0];
			console.log("New tweet = " + lastTweet.text);
			ringTheBell();
		}
	}
}

setInterval(function() {
	t.get('search/tweets', { q: '#hardwarehack', since_id: lastTweet.id, count: 3 }, processTweets);
}, 10000);

