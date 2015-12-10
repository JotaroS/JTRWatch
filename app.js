
var request = require('request');
var parseString = require('xml2js').parseString;
var temp = 0;
url = 'http://www.drk7.jp/weather/xml/13.xml';
var rain =0;
    request(url,function (error, response, body) {

        if (!error && response.statusCode == 200) {
            parseString(body, function (err, result) {
               rain =result.weatherforecast.pref[0].area[3].info[0].rainfallchance[0].period[3]._;
            /*  
                var day = result.weatherforecast.pref[0].area[3].info[0]['$'].date + "\n";
                var weather = result.weatherforecast.pref[0].area[3].info[0].weather[0] + "\n";
                var detail = result.weatherforecast.pref[0].area[3].info[0].weather_detail[0] + "\n";
                var max = "最高気温は" + result.weatherforecast.pref[0].area[3].info[0].temperature[0].range[0]._ + "度\n";
                var min = "最低気温は" + result.weatherforecast.pref[0].area[3].info[0].temperature[0].range[1]._ + "度です";
     
                var message = "おはようございます。天気予報です\n" + day + weather + detail + max + min;
                
                console.log(message);
        */

            });
        } else { 
            console.log(error + " : " + response);
        }
    });

module.exports={
getRain : function(callback){
    var rain;
    request(url,function (error, response, body) {

        if (!error && response.statusCode == 200) {
            parseString(body, function (err, result) {
               rain =result.weatherforecast.pref[0].area[3].info[0].rainfallchance[0].period[3]._;
               callback(null,rain);
            /*  
                var day = result.weatherforecast.pref[0].area[3].info[0]['$'].date + "\n";
                var weather = result.weatherforecast.pref[0].area[3].info[0].weather[0] + "\n";
                var detail = result.weatherforecast.pref[0].area[3].info[0].weather_detail[0] + "\n";
                var max = "最高気温は" + result.weatherforecast.pref[0].area[3].info[0].temperature[0].range[0]._ + "度\n";
                var min = "最低気温は" + result.weatherforecast.pref[0].area[3].info[0].temperature[0].range[1]._ + "度です";
     
                var message = "おはようございます。天気予報です\n" + day + weather + detail + max + min;
                
                console.log(message);
        */

            });
        } else { 
            console.log(error + " : " + response);
        }
    });
    return rain;
}

}
