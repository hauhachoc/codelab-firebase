var five = require("johnny-five");
var board = new five.Board();

board.on("message", function(event) {
  console.log("%s send '%s' with: %s",event.type,event.class,event.message);
});

board.on("ready", function(){
  var led2 = new five.Led(2);
  var led3 = new five.Led(3);
  var led4 = new five.Led(4);

  led2.blink(500);
  led3.pulse(500);
  led4.strobe(500);
});
