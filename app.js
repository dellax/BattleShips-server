var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) { });

server.listen(8000, function() {
  console.log('Listening on port ' + server.address().port); //Listening on port 8888
});

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});
var clients = [ ];

// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);

  var index = clients.push(connection) - 1;
  // This is the most important callback for us, we'll handle
  // all messages from users here.

  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log(message);
      var json = JSON.stringify({ type:'message', data: {test: "ahoj"} });
      for (var i=0; i < clients.length; i++) {
        clients[i].sendUTF(json);
      }
    }
  });

  connection.on('close', function(connection) {
    console.log(connection);
    clients.splice(index, 1);
  });
});