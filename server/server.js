const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

const ioPort = 8000;
const io = require('socket.io').listen(ioPort);
var clientDict = {};
io.on('connection', client => {
    var address = client.request._query["address"];
    clientDict[address] = client.id;
    console.log("[" + address + "] connected.")

    onEvent(client, 'contractTerminated');
    onEvent(client, 'depositTransferred');
    onEvent(client, 'payment');
    onEvent(client, 'paymentApproved');
});

function onEvent(client, eventName) {
    client.on(eventName, data => {
        client.broadcast.to(clientDict[data.to]).emit(eventName, data);
    });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
