const express = require('express');
const app = express();
const http = require('http').Server(app)
const port = process.env.PORT || 5000;

const io = require('socket.io').listen(http);
var clientDict = {};
io.on('connection', (client) => {
  var address = client.request._query["address"];
  console.log("[" + address + "] connected.")
  client.on('sendMessage', (data) => {
      console.log("Message to " + data.address);
      client.broadcast.emit('receiveMessage', data.message);
  });
  client.on('handshake', (data) => {
      console.log("Handshake with " + data.to);
      client.broadcast.emit('handshake', data);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
