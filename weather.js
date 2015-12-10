var getWeather = require('./app.js');
var r=0;
var txt = "result is:"
function handleresult(result){
    r = result;
    txt=txt+r;
    console.log(txt);
}
function returnResult(err,result){
    console.log(result);
    handleresult(result);
}
getWeather.getRain(returnResult)
