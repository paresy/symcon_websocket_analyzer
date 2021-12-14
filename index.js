let WebSocket = require('ws');

const ws = new WebSocket('ws://127.0.0.1:3777/api/');

ws.on('open', function open() {
  console.log('Connected...');
});

let biggestMessages = [];
let busyMessages = {};
let busyIDs = {};

let startTime = new Date().getTime();
let count = 0;

ws.on('message', function message(data) {
  let json = JSON.parse(data);

  // Increment counter
  count++;

  // Update counter
  biggestMessages.push(data);
  biggestMessages.sort((a, b) => {
    return b.length - a.length;
  });
  biggestMessages = biggestMessages.slice(0, 5);
  if (!busyMessages[json["Message"]]) {
    busyMessages[json["Message"]] = 0;
  }
  busyMessages[json["Message"]]++;
  if (!busyIDs[json["SenderID"]]) {
    busyIDs[json["SenderID"]] = 0;
  }
  busyIDs[json["SenderID"]]++;

  // Update CLI
  update();
});

function secondsElapsed() {
  return (new Date().getTime() - startTime) / 1000;
}

function update() {
  process.stdout.write('\033c');

  console.log("Received: " + count.toString() + ", " + Math.round(count / secondsElapsed()).toString() + " msg/s");
  console.log("");

  console.log("Longest Messages:");
  for(let m of biggestMessages) {
    let j = JSON.parse(m);
    console.log("> Message: " + j["Message"].toString() + ", SenderID: " + j["SenderID"].toString() + ", Length: " + m.length.toString());
  }
  console.log("");

  let bm = [];
  for(x in busyMessages) {
    bm.push({Message: x, Count: busyMessages[x]});
  }
  bm.sort((a, b) => {
    return b.Count - a.Count;
  });
  bm = bm.slice(0, 5);
  console.log("Busy Messages:");
  for(let x of bm) {
    console.log("> Message: " + x.Message.toString() + ", Count: " + x.Count.toString());
  }
  console.log("");

  let bi = [];
  for(x in busyIDs) {
    bi.push({SenderID: x, Count: busyIDs[x]});
  }
  bi.sort((a, b) => {
    return b.Count - a.Count;
  });
  bi = bi.slice(0, 5);
  console.log("Busy IDs:");
  for(let x of bi) {
    console.log("> SenderID: " + x.SenderID.toString() + ", Count: " + x.Count.toString());
  }
}