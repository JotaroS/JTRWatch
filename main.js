//The OLED Display code is adapted from the Adafruit GFX library for Arduino
var sys = require('util');
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

//////////////////////////////////////////////////////////////////////////////
// feedparser - https://www.npmjs.org/package/feedparser
var news_str = new Array(1024);
news_str[0]="";

///////////////////////////////////////////////////////////////////////////////

Edison.enable_i2c6_breakout(startLCD);
var day;
var time;
function startLCD()
{
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
  getNews();
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
    ada.drawString(52,50,news_str[0].substring(cnt/4,cnt/4+13)+str,1,1,1);
    ada.drawString(113,39,""+sec,1,1,1);
    //getWeather.getRain(returnResult);
    lcdTest.display();
    cnt++;
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
        news_str[count]=item.title;
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
