
var left;
var right;
var force = {};
var button;
var leftPlaying = false;
var rightPlaying = false;

var playingRange;
var serial;  //variable to hold the serial port object
var ardVal = [];  //array that will hold all values coming from arduino

var serialPortName = '/dev/cu.usbmodem1411';        //FOR PC it will be COMX on mac it will be something like "/dev/cu.usbmodemXXXX"
                                    //Look at P5 Serial to see the available ports

// TODO: connect arduino values to the videos


function setup() {

  //Setting up the serial port
  serial = new p5.SerialPort();       //create the serial port object
  serial.open(serialPortName);        //open the serialport. determined 
  serial.on('open',ardCon);           //open the socket connection and execute the ardCon callback
  serial.on('data',dataReceived);     //when data is received execute the dataReceived function

  getAudioContext().resume();
  // specify multiple formats for different browsers
  left = createVideo(['slowly.mp4']);
  left.id("left");
  left.size(480, 540);

  right = createVideo(['slowly.mp4']);
  right.size(480, 540);
  //left.position();
  right.id("right");

}

// plays or pauses the video depending on current state


function draw() {
  
// find the difference in playing range
playingRange = Math.abs(force.left-force.right);

// if left is greater than 0, then 
if (force.right > 0  && force.left > 0 ) {
  right.loop();
  left.loop();
  leftPlaying = true;
  rightPlaying = true;

} else if (force.right == 0 && force.left > 0){

  right.pause();
  rightPlaying = false;

  if (leftPlaying == true ) {
    left.speed(1.25);
  } else {
    left.loop();
    left.speed(1.25);
    leftPlaying = true;
    
  }
} else if (force.right > 0 && force.left == 0){

  left.pause();
  leftPlaying = false;

  if (rightPlaying == true) {
    right.speed(1.25);
  } else {
    right.loop();
    right.speed(1.25);
    rightPalying = true;
  }
  
} else {
  right.pause();
  left.pause();

  rightPlaying = false;
  leftPlaying = false;
}
/* if (leftPlaying == false && force.left > 0) {
    left.loop();
    leftPlaying = true;
 } else {
    left.pause();
    leftPlaying = false;
 }

 if (rightPlaying == false && force.right > 0 ) {
    right.loop();
    rightPlaying = true;
 } else {  
    right.pause(); 
    rightPlaying = false;
 }
*/

}

  function dataReceived() {   //this function is called every time data is received
   
    var rawData = serial.readStringUntil('\r\n'); //read the incoming string until it sees a newline
    // console.log(rawData);                       //uncomment this line to see the incoming string in the console     
    if(rawData.length>1)                          //check that there is something in the string
    {                                               
      force.left = JSON.parse(rawData).s1;            //the name of parameter must match the one created in Arduino
      force.right = JSON.parse(rawData).s2;            //the name of parameter must match the one created in Arduino
    }
    return force;
  }

  function ardCon() {
    console.log("connected to the arduino!! Listen UP");
  }