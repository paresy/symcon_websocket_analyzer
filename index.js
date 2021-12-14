let host = "ws://127.0.0.1:3777/api/";
let username = "";
let password = "";

// Show statistics with a maximum of items per category
let maxItems = 5;

// Enabling this option will disable the statistics
let showMessages = false;
let messageFilter = ["KL_MESSAGE"];

// Do not change after this line
let webSocket = require('ws');
let fs = require("fs");

let constants = JSON.parse(fs.readFileSync("./constants.json"));
let conststr = {};
for (let c of constants) {
  conststr[c.Value] = c.Name;
}

let protocols = [];

if (username && password) {
  protocols.push(encodeURIComponent(btoa(username + ':' + password)));
}

const ws = new webSocket(host, protocols);

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

  // Dump messages for debugging
  if (showMessages) {
    if (messageFilter.length === 0 || messageFilter.indexOf(messageToName(json["Message"])) !== -1) {
      console.log(data.toString());
    }
    return;
  }

  // Increment counter
  count++;

  // Update counter
  biggestMessages.push(data);
  biggestMessages.sort((a, b) => {
    return b.length - a.length;
  });
  biggestMessages = biggestMessages.slice(0, maxItems);
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

function messageToName(msg) {
  if (conststr[msg]) {
    return conststr[msg];
  }
  else {
    return msg.toString();
  }
}

function update() {
  process.stdout.write('\033c');

  console.log("Received: " + count.toString() + ", " + Math.round(count / secondsElapsed()).toString() + " msg/s");
  console.log("");

  console.log("Biggest Messages:");
  for(let m of biggestMessages) {
    let j = JSON.parse(m);
    console.log("> Message: " + messageToName(j["Message"]) + ", SenderID: " + j["SenderID"].toString() + ", Length: " + m.length.toString());
  }
  console.log("");

  let bm = [];
  for(x in busyMessages) {
    bm.push({Message: x, Count: busyMessages[x]});
  }
  bm.sort((a, b) => {
    return b.Count - a.Count;
  });
  bm = bm.slice(0, maxItems);
  console.log("Busy Messages:");
  for(let x of bm) {
    console.log("> Message: " + messageToName(x.Message) + ", Count: " + x.Count.toString());
  }
  console.log("");

  let bi = [];
  for(x in busyIDs) {
    bi.push({SenderID: x, Count: busyIDs[x]});
  }
  bi.sort((a, b) => {
    return b.Count - a.Count;
  });
  bi = bi.slice(0, maxItems);
  console.log("Busy IDs:");
  for(let x of bi) {
    console.log("> SenderID: " + x.SenderID.toString() + ", Count: " + x.Count.toString());
  }
}