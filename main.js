//The OLED Display code is adapted from the Adafruit GFX library for Arduino
var sys = require('util');
var getWeather = require('./app.js');
var SSD1306 = require('./ssd1306.js');
var AFGFX = require('./Adafruit_GFX.js');
var fs = require('fs');
var Edison = require('./Edison.js');
var rootDir = __dirname+'/images/';
var imageList = [];
var lcdTest = null;
var ada = null;
var picIndex = 0;
var slideShowTimer = 0;

Edison.enable_i2c6_breakout(startLCD);

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
    while(1)
        drawMenu(); 
    
}

var count = 0;
var r = 0.0;
function returnResult(err,result){
    console.log(result);
    handleresult(result);
    ada.drawString(55,50,"12˚C 24%",1,1,1);
}
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

function drawMenu(){
    lcdTest.clear();
    
    //header
    ada.drawString(0,0,"JTRWatch",1,1,1);
    ada.drawString(100,0,"100%",1,1,1);
    //clock
    ada.drawLine(0,10,128,10,1);
    ada.drawCircle(28,37,18,1);
    ada.drawLine(28,37,30,22,1);
    ada.drawLine(28,37,35,47,1);
    //cal
    ada.drawString(55,20,"Mon Dec 21",1,1,1);
    //time
    ada.drawString(55,32,"00:20",1,2,2);
    //Weather
    //ada.drawString(55,50,"12˚C 24%",1,1,1);
    getWeather.getRain(returnResult);
    lcdTest.display();
    
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
