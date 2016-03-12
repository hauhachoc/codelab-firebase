var five = require("johnny-five"),
  board, button, led2, led3, led4;

var Firebase = require("firebase");
var dataRef = new Firebase('https://codelabg.firebaseio.com/ardx/');
var state = "off";

var sendSignal = function(isOn){
  if(state == isOn){
    return;
  }
  state = isOn;
  dataRef.set(isOn);
};

board = new five.Board();

board.on("ready", function() {
  led2 = new five.Led(2);
  led3 = new five.Led(3);
  led4 = new five.Led(4);

  // Create a new `button` hardware instance.
  // This example allows the button module to
  // create a completely default instance
  button = new five.Button(5);

  // Inject the `button` hardware into
  // the Repl instance's context;
  // allows direct command line access
  board.repl.inject({
    button: button
  });

  // Button Event API

  // "down" the button is pressed
  button.on("down", function() {
    console.log("down");
    led2.stop();
    led2.on();

    led3.stop();
    led3.on();
    
    led4.stop();
    led4.on();

    sendSignal("on");
  });

  // "hold" the button is pressed for specified time.
  //        defaults to 500ms (1/2 second)
  //        set
  button.on("hold", function() {
    console.log("hold");
    led2.strobe();

    led3.pulse();

    led4.toggle();

    sendSignal("toggle");
  });

  // "up" the button is released
  button.on("up", function() {
    console.log("up");
    led2.stop();
    led2.off();

    led3.stop();
    led3.off();

    led4.stop();
    led4.off();

    sendSignal("off");
  });
});