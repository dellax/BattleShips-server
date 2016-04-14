"use strict";

var WebSocketServer = require('websocket').server;
var http = require('http');
var GamesManagement = require('./lib/GamesManagement');

var server = http.createServer(function (request, response) {
});

server.listen(8000, function () {

    console.log('Listening on port ' + server.address().port);
});

var wsServer = new WebSocketServer({
        httpServer: server
    }),
    gamesManagement = new GamesManagement();

// WebSocket server
wsServer.on('request', function (request) {
    var connection = request.accept(null, request.origin);

    var key = gamesManagement.addConnection(connection);

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            gamesManagement.processMessage(message, key);
            /*console.log(message);
             var json = JSON.stringify({type: 'message', data: {test: "ahoj"}});
             for (var i = 0; i < clients.length; i++) {
             clients[i].sendUTF(json);
             }*/
        }
    });

    connection.on('close', function (connection) {

        gamesManagement.removeConnection(key);
    });
});