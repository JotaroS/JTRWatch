var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'zSGkuI4cuhBTt9hbF5V3MKk2S',
  consumer_secret: 'MfiaPHNIpN9wFLGQo1geXPRds9mBl9CoNLar2pW5couK6Tl1un',
  access_token_key: '916808642-TZf1Iio7nXf4DJp6xHnRe1bFEjxdZomGxhqyRnat',
  access_token_secret: 'FvKX7EN1Q1bzNDGOPTcUbhZtFCJAvud2g2JksBizuJA44'
});

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/
client.stream('statuses/filter', {track: 'JotaroUT'},  function(stream){
  stream.on('data', function(tweet) {
    console.log(tweet.text);
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});