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
      var groups = await handler.getGroupsIdsAsync(response);
      console.log('GROUPS: ' + JSON.stringify(groups));
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
    console.log('\n\n user socket id : '+ socket.id);
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
      console.log('\n\n my user id is : ' + data.userId +" my socket ID is : "+socket.id+" \n\n");
      response = await handler.addUserToGroupAsync(data);
      console.log('responding to client with: ' + JSON.stringify(response));

      //subscribe to the chat
      socket.join(response.groupId);

    }catch(ex) {
      error = ex;
    }
    callback(error, response);
  });
  
  socket.on('removeUserFromGroup', async(data, callback) => { // data should contain only the groupId
    var error = null;
    var response = null;
    console.log('am primit remove user from group de la client. ' + JSON.stringify(data));
    try{
      data.userId = connectedUsers[socket.id].userId;
      console.log('daaa --- '+JSON.stringify(data));
      response = await handler.removeUserFromGroupAsync(data);
      console.log('responding to client with: ' + JSON.stringify(response));

      //unsubscribe to the chat
      socket.leave(data.groupId);

    }catch(ex) {
      error = ex;
    }
    callback(error, response);
  });
  
  
  socket.on('sendMessage', async(data, callback) => { // data should contain the groupId,message,messageType
    var error = null;
    var response = null;
    console.log('am primit send message de la client. ' + JSON.stringify(data));
    try{
      data.userId = connectedUsers[socket.id].userId;
      var response = await handler.addGroupMessageAsync(data);
      console.log("---> OK response -- " + JSON.stringify(response));
      //send message to room
      io.to(data.groupId).emit('receivedMessage', response);

    }catch(ex) {
      error = ex;
      console.error('error on send message ' + JSON.stringify(ex));
    }
    callback(error, response);
  });

  socket.on('getGroups', async(nullValue, callback) => { // data should contain the groupId
    var error = null;
    var response = null;
    console.log('am primit get groups de la client. ');
    try{

      response = await handler.getGroupsIdsAsync({ userId: connectedUsers[socket.id].userId });
      response = response.entries;
      console.log('111111111119900 ' + JSON.stringify(response));
    }
    catch(ex) {
      error = ex;
    }
    callback(error, response);
  });

  socket.on('getUsersInfoFromChats', async(data, callback) => { // data should contain the groupId
    var error = null;
    var response = null;

    console.log('>>>>>>>>>>>>>>>>>>>>>> am primit get users info from chats de la client. ' + JSON.stringify(data));
    try{
      response = await handler.getUsersInfoFromChatsAsync({ userId: connectedUsers[socket.id].userId });
      console.log('6666613333389898 ' + JSON.stringify(response));
    }
    catch(ex) {
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
      console.log('1111111111133333 ' + JSON.stringify(response));
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

});
