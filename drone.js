// Require modules.
const arDrone = require('ar-drone');
const readline = require('readline');
const HID = require('node-hid');
const parseButton = require('./button-parse.js');

// Create drone instance.
const client = arDrone.createClient();

// Create PNG stream server.
//require('ar-drone-png-stream')(client, { port: 8000 });

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {
    switch( key.name) {
        case "up"   : goForward(); break;
        case "down" : goBack(); break;
        case "left" : goAnti(); break;
        case "right" : goClock(); break;
        case "a": goUp(); break;
        case "z": goDown(); break;
        case "q": takeoff(); break;
        case "w": land(); break;
        default: console.log(key.name); break;
    }
  }
});

function goForward(){
    client.front(.5);
}
function goBack(){
    client.back(.5);
}
function goAnti(){
    client.counterClockwise(.75);
}
function goClock(){
    client.clockwise(.75);
}

function goUp(){
    client.up(0.2);
}
function goDown(){
    client.down(0.2);
}

function takeoff(){
    client.takeoff();
}
function land(){
    client.land();
}

// Print out battery percentage.
client.on('navdata', (data) => {
    // console.log('----------------------------------\n', data.demo + '%');
});

// PS4 Controller
const controller = new HID.HID("\\\\?\\hid#vid_054c&pid_05c4#6&382308f8&0&0000#{4d1e55b2-f16f-11cf-88cb-001111000030}");

controller.on("data", function(data){
    const {cross, triangle, leftAnalogX, rightAnalogY} = parseButton(data);

    if(leftAnalogX === 0){
        goAnti();
    } else if(leftAnalogX === 255){
        goClock();
    }

    if(rightAnalogY === 255){
        goForward();
    } else if(rightAnalogY === 0){
        goBack();
    }

    if(cross){
        land();
    } else if(triangle){
        takeoff();
    }

    return;

});
