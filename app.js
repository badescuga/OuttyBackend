/* global __dirname */
/* global process */
// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
import * as handler from './js/handler.js';


var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var connectedUsers = {};
var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  // socket.on('init', function (data) {
  //   console.log('am primit init de la client.');
  //   socket.emit('init', {});
  // });

  socket.on('login', async(data, callback) => {
    var error = null;
    var response = null;
    console.log('am primit login de la client. ' + JSON.stringify(data));

    try {
      // login/create user
      response = await handler.loginUserAsync(data);
      connectedUsers[socket.id] = response;

      console.log('received response from login: ' + JSON.stringify(response));

      // subscribing user to rooms(groups)
      var groups = await handler.getGroupsAsync(response);
      groups = groups.entries;
      groups.forEach(function (item) {
        console.log('joining room: ' + item.PartitionKey._);
        socket.join(item.PartitionKey._);
      });
    }
    catch (ex) {
      var error = ex;
      console.error('error logging user in ' + JSON.stringify(error));
    }

    callback(error, response);
  });

  socket.on('createGroup', async(data, callback) => { // data should contain only the name of the group
    var error = null;
    var response = null;
    console.log('am primit create group de la client. ' + JSON.stringify(data));
    try {
      data.userId = connectedUsers[socket.id].userId;
      response = await handler.createGroupAsync(data);
      console.log('responding to client with: ' + JSON.stringify(response));

      //subscribe to the chat
      socket.join(response.groupId);
    }catch(ex) {
      error = ex;
    }
    callback(error, response);
  });

  socket.on('joinGroup', async(data, callback) => { // data should contain only the groupId
    var error = null;
    var response = null;
    console.log('am primit join group de la client. ' + JSON.stringify(data));
    try{
      data.userId = connectedUsers[socket.id].userId;
      response = await handler.addUserToGroupAsync(data);
      console.log('responding to client with: ' + JSON.stringify(response));

      //subscribe to the chat
      socket.join(response.groupId);

    }catch(ex) {
      error = ex;
    }
    callback(error, response);
  });

  socket.on('addGroupMessage', async(data, callback) => { // data should contain the groupId,message,messageType
    var error = null;
    var response = null;
    console.log('am primit join group de la client. ' + JSON.stringify(data));
    try{
      data.userId = connectedUsers[socket.id].userId;
      var response = await handler.addGroupMessageAsync(data);

      //send message to room
      io.to(data.groupId).emit('receivedMessage', data);

    }catch(ex) {
      error = ex;
    }
    callback(error, response);
  });

  socket.on('getGroupMessages', async(data, callback) => { // data should contain the groupId
    var error = null;
    var response = null;
    console.log('am primit get group messages de la client. ' + JSON.stringify(data));
    try{
      response = await handler.getGroupMessagesAsync(data);
      console.log('1111111111133333 '+JSON.stringify(response));
    }
    catch(ex) {
      error = ex;
    }

    callback(error, response);
  });

  socket.on('disconnect', function () {
    console.log('disconnected socket: ' + socket.id);
    delete connectedUsers[socket.id];
  });











  ////////////////////////test data
  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
