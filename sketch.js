var playing1 = false;
var playing2 = false;
var slowly1;
var slowly2;
var force = {};
var button;
var playback1;
var playback2;
var newPlayback1;
var nePlayback2;
var range;
var leftVid;
var rightVid;
var serial;  //variable to hold the serial port object
var timer = 0;     // used to time
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
  slowly1 = createVideo(['slowly.mp4']);
  slowly1.id("slowly1");
  slowly1.size(360, 360);

  slowly2 = createVideo(['slowly.mp4']);
  slowly2.size(360, 360);
  slowly2.id("slowly2");

  leftVid = document.getElementById("slowly1");
  rightVid = document.getElementById("slowly2");

}

// plays or pauses the video depending on current state


function draw() {
  if ((force.right || force.left > 0)) {
    console.log("right: " + force.right+ " left: " + force.left+ 'greater than 0')
    var playingRange = Math.abs(force.right - force.left);

    if (force.right > 0 ) { 
      slowly2.loop();
      playing2 = true;

      if (force.right > force.left) {
      
        for (var i = 0; i < playingRange; i ++) {
          slowly2.speed(i);
        }
        
      }
    } else {
      slowly2.pause();
      playing2 = false;
    }

    if (force.left > 0 ) {
      slowly1.loop();

      if (force.left > force.right) {
        for (var i = 0; i < playingRange; i ++) {
          slowly1.speed(i);
        }
      playing1 = true;
    } else {
      slowly1.pause();
      playing1 = false;
    }   

  } else {
    slowly1.pause();
    slowly2.pause();

    var range = Math.abs(leftVid.currentTime - rightVid.currentTime);

    if (playing1 || playing2 == false) {
      
      if (frameCount % 60 == 0) {
        timer++;
      }
      if (1.5 < range < 12.5 ) {
        if (timer > 3) { // if playing1 & playing2 are set to false for longer than 2 seconds, find the longer one unti it catches up
          if (leftVid.currentTime < rightVid.currentTime) {
            slowly1.loop();
            timer = 0;  
          } else {
            slowly2.loop();
            timer = 0;  
          }
        }
        
      } else {
        slowly1.pause();
        slowly2.pause();
        timer = 0;
      }
    }
  }
  }
}
function toggleVid() {
  if (playing) {
    knock.pause();
  } else {
    knock.play();
  }
  playing = !playing;
}
function twice_speed() {
    slowly1.speed(2);
    slowly2.speed(2);
  }
  
  function half_speed() {
    slowly1.speed(0.5);
    slowly2.speed(0.5);
  }
  
  function reverse_speed() {
    slowly1.speed(-1);
    slowly2.speed(-1);
  }
  
  function stop_video() {
    
    console.log(vid1.currentTime);
    vid2.currentTime;
    
    slowly1.pause();
    slowly2.pause();
  }
  
  function play_speed() {
    var vid1 = document.getElementById("slowly1");
    console.log(vid1.duration);
    slowly1.loop();
    slowly2.loop();
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