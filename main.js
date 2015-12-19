//The OLED Display code is adapted from the Adafruit GFX library for Arduino
var sys = require('util');
var m = require('mraa');
var getWeather = require('./app.js');
var SSD1306 = require('./ssd1306.js');
var AFGFX = require('./Adafruit_GFX.js');
var fs = require('fs');
var Edison = require('./Edison.js');
var rootDir = __dirname+'/images/';
require('date-utils');
var imageList = [];
var lcdTest = null;
var ada = null;
var picIndex = 0;
var slideShowTimer = 0;

var myPin = new m.Gpio(55);

//////////////////////////////////////////////////////////////////////////////
// feedparser - https://www.npmjs.org/package/feedparser
var news_str = new Array(1024);
news_str[0]="";
///////////////////////////////////////////////////////////////////////////////

var STATE = {
 MAIN : 0,
 NEWS : 1,
 MAIL : 2,
};
var JTRState = STATE.NEWS;
///////////////////////////////////////////////////////////////////////////////

Edison.enable_i2c6_breakout(startLCD);
var day;
var time;
function startLCD()
{
  console.log('MRAA Version '+m.getVersion());
  lcdTest = new SSD1306();
  ada = new AFGFX(128,64);
  lcdTest.init();
  lcdTest.clear();
  lcdTest.display();
  
  //make an array of all the image in the images directory
  listImages();
  //  listLogo();

  //start the slide show
  //slideShow();
  
  getWeather.getRain(returnRainResult);
  getWeather.getTemp(returnTempResult);
  getWeather.getWeather(returnWeatherResult);
  setInterval(function(){getWeather.getRain(returnRainResult);
                          getWeather.getTemp(returnTempResult);
                          getWeather.getWeather(returnWeatherResult);
  },30000);
    //while(1)
  drawMenu();
  setInterval(function(){drawMenu();},10); 
  setInterval(function(){switchState();},20000);
  setInterval(function(){getNews();},600000);
  setInterval(function(){vibrate();},10);  
  setInterval(function(){vibReset();},5000); 
}

var count = 0;
var r = 0.0;
var str = "fetching..."
var temp_str="";
var weather_str="";
function draw(){
    lcdTest.clear();
    for(var i=0;i<1;i++)
        ada.drawCircle(i*5,10,10*r,1);
    for(var i=0;i<1;i++)
        ada.drawLine(0,0,120,i*10,1);
    //ada.drawChar(10,10,"0".charCodeAt(0),1,2,2);
    ada.drawString(count,40,"jotaro",1,2,2);
    lcdTest.display();
    if(count<128)count++;
    else count =0;
    //setTimeout(draw,100); //16.666[ms] = 60[fps]
}
var cnt =0;


function drawMenu(){
    lcdTest.clear();
    var dt = new Date();
    day = dt.toFormat("DDD MMM DD");
    time = dt.toFormat("HH24:MI");
    sec = dt.toFormat("SS");
    var _min =parseFloat(dt.toFormat("MI"));
    var _hr  =parseFloat(dt.toFormat("HH24"));
    //header
    ada.drawString(0,0,"JTRWatch",1,1,1);
    ada.drawString(100,0,"100%",1,1,1);
    ada.drawLine(0,10,128,10,1);
    //clock
    ada.drawCircle(25,37,18,1);
    ada.drawLine(25,37,parseInt(25+17*Math.sin(-_min*6.0*Math.PI/180+Math.PI)),
      parseInt(37+17*Math.cos(-_min*6.0*Math.PI/180+Math.PI)),1);
    ada.drawLine(25,37,parseInt(25+14*Math.sin(-(_hr*30.0+_min*0.5)*Math.PI/180+Math.PI)),
      parseInt(37+14*Math.cos(-(_hr*30.0+_min*0.5)*Math.PI/180+Math.PI)),1);
    //cal
    ada.drawString(52,20,""+day,1,1,1);
    //time
    ada.drawString(52,31,""+time,1,2,2);
    //Info max str 13
    var info = temp_str +weather_str;
    if(JTRState ==STATE.NEWS){ada.drawString(52,50,news_str[0].substring(cnt,cnt+13)+info,1,1,1);
      cnt+=0.5;}
    if(JTRState ==STATE.MAIN){ada.drawString(52,50,info,1,1,1); cnt = 0;}

    ada.drawString(113,39,""+sec,1,1,1);
    //getWeather.getRain(returnResult);
    lcdTest.display();
    
}

var vibcount = 0;
function vibrate(){
  vibcount++;
  myPin.dir(m.DIR_OUT);
  if(vibcount<2){
      myPin.write(1);
      console.log(vibcount);
  }
  else myPin.write(0);
}
function vibReset(){
  vibcount =0;
}
function drawInfo(){
    ada.drawString(55,50,temp_str+str+"%",1,1,1);
}
function returnRainResult(err,result){
    console.log("hi");
    console.log(result);
    str = result+"%";
    //ada.drawString(55,50,str+"12˚C 24%",1,1,1);
}
function returnTempResult(err,res_h,res_l){
    temp_str=res_l+"to"+res_h+"C ";
}
function returnWeatherResult(err,res){
    console.log("weater");
    var txt="";
    if (res.match("くもり")) txt=  "cloudy ";
    else if(res.match("晴れ")) txt="fine    ";
    else if(res.match("雨")) txt = "rainy   ";
    console.log(txt);
    weather_str=txt;
}
function slideShow() {
  displayPNG(rootDir + imageList[picIndex]);
  picIndex++;
  if (picIndex >= imageList.length) {
    picIndex = 0;
  }
  clearTimeout(slideShowTimer);
  slideShowTimer = setTimeout(slideShow, 200);
}


function listImages() {
  var fileList = fs.readdirSync(rootDir);
  for (var i in fileList) {
    var fileName = fileList[i];

    if (fileName.match(/.+\.png$/i)) {
      console.log(fileName);
      imageList.push(fileName);
    }
  }
}

function listLogo() {
  var fileList = fs.readdirSync(rootDir);
  for (var i in fileList) {
    var fileName = fileList[i];

    if (fileName.match(/jtr-1.png$/i)) {
      console.log(fileName);
      imageList.push(fileName);
    }
  }
}

function getNews(){
  var count =0;
  var FeedParser = require('feedparser')
    , request = require('request');

var req = request('http://feeds.reuters.com/reuters/topNews')
    , feedparser = new FeedParser(); // new FeedParser([options])でoptions設定

req.on('error', function (error) {
    // リクエストエラー処理
});
req.on('response', function (res) {
    var stream = this;
    if (res.statusCode != 200) {
        return this.emit('error', new Error('Bad status code'));
    }
    stream.pipe(feedparser);
});

feedparser.on('error', function(error) {
    // 通常のエラー処理
});
feedparser.on('readable', function() {
    var stream = this
        , meta = this.meta
        , item;
    if(item = stream.read()) {
        // タイトルとリンクを取得
        console.log(item.title);
        news_str[count]="             "+item.title+"   ";
        count++;
    }
});
}

function displayPNG(fullPathToPNG) {
  var PNG = require('pngjs').PNG;

  fs.createReadStream(fullPathToPNG)
    .pipe(new PNG({
      filterType: 4
    }))
    .on('parsed', function () {
      lcdTest.clear();
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var idx = (this.width * y + x) << 2;
          // invert color
          if (this.data[idx] == 0 && this.data[idx + 1] == 0 && this.data[idx + 2] == 0) {
            lcdTest.drawPixel(x, y, 1);
          } else {
            lcdTest.drawPixel(x, y, 0);
          }
        }
      }
      lcdTest.display();
    });
}


var statecnt = 0;
function switchState(){
  JTRState++;
  if(JTRState>3)JTRState=STATE.MAIN;
  console.log('JTRState = '+JTRState);
}




/////////////////////////////////////////////////





var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Gmail API.
  authorize(JSON.parse(content), listLabels);
  authorize(JSON.parse(content), listMessages);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**ロボット　#utmc2
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  var gmail = google.gmail('v1');
  gmail.users.labels.list({
    auth: auth,
    userId: 'me',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var labels = response.labels;
    if (labels.length == 0) {
      console.log('No labels found.');
    } else {
      console.log('Labels:');
      for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        console.log('- %s', label.name);
      }
    }
  });
}

function listMessages(auth) {
  var gmail = google.gmail('v1');
  gmail.users.messages.list({
    auth: auth,
    userId: 'me',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var messages = response.messages;
    if (messages.length == 0) {
      console.log('No messages found.');
    } else {
      console.log('messages:');
      for (var i = 0; i < 1; i++) {
        var message = messages[i];
        var _id = message.id;
        console.log('- %s', message.id);
        gmail.users.messages.get({
          auth: auth,
          userId: 'me',
          id : _id,
        },function(err,res){
          if (err) {
            console.log('The API returned an error: ' + err);
          return;
          }
          console.log('<<New Mail>>'+res.snippet+res.id);
        });



      }
    }
  });
}

