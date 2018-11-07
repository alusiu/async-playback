var playing = false;
var slowly1;
var slowly2;
var button;

var serial;       //variable to hold the serial port object
var ardVal = [];  //array that will hold all values coming from arduino

var serialPortName = '/dev/cu.usbmodem1411';        //FOR PC it will be COMX on mac it will be something like "/dev/cu.usbmodemXXXX"
                                    //Look at P5 Serial to see the available ports

// TODO: create a true false variable to determine if the video is playing
// TODO: try and find a way to see where the video is in the loop (time)
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

  button = createButton('play');
  button.mousePressed(play_speed); // attach button listener

  button = createButton('2x speed');
  button.position(100, 68);
  button.mousePressed(twice_speed);

  button = createButton('half speed');
  button.position(200, 68);
  button.mousePressed(half_speed);

  button = createButton('reverse play');
  button.position(300, 68);
  button.mousePressed(reverse_speed);

  button = createButton('STOP');
  button.position(400, 68);
  button.mousePressed(stop_video);

}

// plays or pauses the video depending on current state
// function toggleVid() {
//   if (playing) {
//     knock.pause();
//     button.html('play');
//   } else {
//     knock.play();
//     button.html('pause');
//   }
//   playing = !playing;


// }

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
    var vid1 = document.getElementById("slowly1");
    var vid2 = document.getElementById("slowly2");
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
    console.log(rawData);   
    if(rawData.length>1) {                     //check that there is something in the string
                                              //values received in pairs  index,value
          var incoming = rawData.split(",");      //split the string into components using the comma as a delimiter
          for(var i=0;i<incoming.length;i++) {
            ardVal[i]=parseInt(incoming[i]);        //convert the values to ints and put them into the ardVal array
          }
        }
  }

  function ardCon() {
    console.log("connected to the arduino!! Listen UP");
  }