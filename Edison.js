//This code is a hack... And I know it :)
module.exports = {
   enable_i2c6:function(callback) {

    var enablei2c_command = 'echo 28 > /sys/class/gpio/export; echo 27 > /sys/class/gpio/export; echo 204 > /sys/class/gpio/export; echo 205 > /sys/class/gpio/export; echo 236 > /sys/class/gpio/export; echo 237 > /sys/class/gpio/export; echo 14 > /sys/class/gpio/export; echo 165 > /sys/class/gpio/export; echo 212 > /sys/class/gpio/export; echo 213 > /sys/class/gpio/export; echo 214 > /sys/class/gpio/export; echo low > /sys/class/gpio/gpio214/direction; echo low > /sys/class/gpio/gpio204/direction; echo low > /sys/class/gpio/gpio205/direction; echo in > /sys/class/gpio/gpio14/direction; echo in > /sys/class/gpio/gpio165/direction; echo low > /sys/class/gpio/gpio236/direction; echo low > /sys/class/gpio/gpio237/direction; echo in > /sys/class/gpio/gpio212/direction; echo in > /sys/class/gpio/gpio213/direction; echo mode1 > /sys/kernel/debug/gpio_debug/gpio28/current_pinmux; echo mode1 > /sys/kernel/debug/gpio_debug/gpio27/current_pinmux; echo high > /sys/class/gpio/gpio214/direction;';
     var exec = require('child_process').exec, child;

    child = exec(enablei2c_command, {env:process.env}, 
      function (error, stdout, stderr) {
        //console.log('stdout: ' + stdout);
       // console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });

    if(typeof callback === 'function') {
      child.on('exit',callback);
    }
  },
     enable_i2c6_breakout:function(callback) {

    var enablei2c_command = 'echo 28 > /sys/class/gpio/export; echo 27 > /sys/class/gpio/export; echo mode1 > /sys/kernel/debug/gpio_debug/gpio28/current_pinmux; echo mode1 > /sys/kernel/debug/gpio_debug/gpio27/current_pinmux;';
     var exec = require('child_process').exec, child;

    child = exec(enablei2c_command, {env:process.env}, 
      function (error, stdout, stderr) {
        //console.log('stdout: ' + stdout);
       // console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });

    if(typeof callback === 'function') {
      child.on('exit',callback);
    }
  },
  enable_analog0:function(callback) {

    var enablei2c_command = 'echo 200 > /sys/class/gpio/export; echo 232 > /sys/class/gpio/export; echo 208 > /sys/class/gpio/export; echo 214 > /sys/class/gpio/export; echo low > /sys/class/gpio/gpio214/direction; echo high > /sys/class/gpio/gpio200/direction; echo low > /sys/class/gpio/gpio232/direction; echo in > /sys/class/gpio/gpio208/direction; echo high > /sys/class/gpio/gpio214/direction;';
     var exec = require('child_process').exec, child;

    child = exec(enablei2c_command, {env:process.env}, 
      function (error, stdout, stderr) {
        //console.log('stdout: ' + stdout);
       // console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });

    if(typeof callback === 'function') {
      child.on('exit',callback);
    }
  },
     readAnalog0:function(callback) {

    var enablei2c_command = 'echo 28 > /sys/class/gpio/export; echo 27 > /sys/class/gpio/export; echo mode1 > /sys/kernel/debug/gpio_debug/gpio28/current_pinmux; echo mode1 > /sys/kernel/debug/gpio_debug/gpio27/current_pinmux;';
     var exec = require('child_process').exec, child;

    child = exec(enablei2c_command, {env:process.env}, 
      function (error, stdout, stderr) {
        //console.log('stdout: ' + stdout);
       // console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });

    if(typeof callback === 'function') {
      child.on('exit',callback);
    }
  }
}