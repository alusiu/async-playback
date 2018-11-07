var playing = false;
var knock;
var ball;
var button;


function setup() {
  //createCanvas(displayWidth, displayHeight);
  getAudioContext().resume();
  // specify multiple formats for different browsers
  slowly1 = createVideo(['slowly.mp4']);
  slowly1.size(360, 360);
  slowly2 = createVideo(['slowly.mp4']);
  slowly2.size(360, 360);

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
    slowly1.stop();
    slowly2.stop();
  }
  
  function play_speed() {
    slowly1.loop();
    slowly2.loop();
  }