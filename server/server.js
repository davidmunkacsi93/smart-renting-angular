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
var usersCollection = [];

io.on('connection', client => {
    var address = client.request._query["address"];
    clientDict[address] = client.id;

    onEvent(client, 'contractTerminated');
    onEvent(client, 'depositTransferred');
    onEvent(client, 'payment');
    onEvent(client, 'paymentApproved');
    onEvent(client, 'rentPaid');

    client.on('join', function(data) {
        usersCollection.push({  
          id: data.address,
          displayName: data.username,
          status: 0,
          avatar: null
        });
    
        client.broadcast.emit("friendsListChanged", usersCollection);
        console.log(data.username + " has joined the chat room. With Id: " + client.id);
    });

    client.on("sendMessage", function(message){
        
        console.log(message);

        var to = clientDict[message.toId];
        var user = usersCollection.find(x => x.id == message.fromId);

        console.log(user);
        client.broadcast.to(to).emit("messageReceived", {
          user: user,
          message: message
        });
      });
});

function onEvent(client, eventName) {
    client.on(eventName, data => {
        client.broadcast.to(clientDict[data.to]).emit(eventName, data);
    });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
