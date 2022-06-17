const fs = require("fs");
const https = require("https");                 
const path = require("path");
const express = require("express");           
const socketIo = require("socket.io");        
const easyrtc = require("open-easyrtc");      

process.title = "next-space-server";

// Express https server
const port = process.env.PORT || 443;
const app = express();
app.use(express.static('client'));
let options = {
    key: fs.readFileSync('server/key.pem'),
    cert: fs.readFileSync('server/cert.pem')
};
const webServer = https.createServer(options, app);

// Start Socket.io so it attaches itself to Express server
const socketServer = socketIo.listen(webServer);
const myIceServers = [
  {"urls":"stun:stun1.l.google.com:19302"},
  {"urls":"stun:stun2.l.google.com:19302"},
];
easyrtc.setOption("appIceServers", myIceServers);
//easyrtc.setOption("logLevel", "debug");
easyrtc.setOption("demosEnable", false);

// testing echo reduction on AWS
easyrtc.echoCancellation = false;
easyrtc.noiseSuppression = true;
// testing echo reduction on AWS

// Overriding the default listeners, only so to directly access its callback and log
easyrtc.events.on("easyrtcAuth", (socket, easyrtcid, msg, socketCallback, callback) => {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, (err, connectionObj) => {
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }
        connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});
        callback(err, connectionObj);
    });
});

// On room join
easyrtc.events.on("roomJoin", (connectionObj, roomName, roomParameter, callback) => {
    console.log("["+connectionObj.getEasyrtcid()+"] joined", roomName);
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});

// On EasyRTC server start
easyrtc.listen(app, socketServer, null, (err, rtcRef) => {
    console.log("EasyRTC initialized");
    // On room create
    rtcRef.events.on("roomCreate", (appObj, creatorConnectionObj, roomName, roomOptions, callback) => {
        console.log("Creating new room : " + roomName);
        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});

// Listen on port
webServer.listen(port, () => {
    console.log("Server listening on:  http://localhost:" + port);
});
