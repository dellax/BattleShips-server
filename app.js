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
            console.log(message, key);
            
            gamesManagement.processMessage(message, key);
        }
    });

    connection.on('close', function (connection) {

        gamesManagement.removeConnection(key);
    });
});
