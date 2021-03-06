"use strict";

var Game = require('./Game');
var Player = require('./Player');
var packageJson = require('../package.json');

function GamesManagement() {

    this._games = {};
    this._connections = {};
}

GamesManagement.prototype = {
    constructor: GamesManagement,

    getGameState: function (i) {

        return this._games[i].getGameState();
    },

    processMessage: function (message, key) {
        var messageData = JSON.parse(message.utf8Data);

        console.log(messageData);

        try {
            switch (messageData.messageType) {

                case "version":
                    this._connections[key].sendUTF(this.sendMessage("version", this.getVersion()));
                    break;

                case "createGame":
                    var gameKey = Math.random().toString(36).slice(2);
                    var game = new Game(gameKey);
                    game.addPlayer(key, true);
                    this._games[gameKey] = game;

                    console.log(gameKey);
                    this.allGamesInfo([key]);
                    this._connections[key].sendUTF(this.sendMessage("gameCreated", {
                        playerKey: key,
                        gameKey: gameKey
                    }));
                    break;

                case "joinGame":
                    var game = this._games[messageData.message.gameKey];
                    game.addPlayer(key, false);

                    var playersKeys = game.getPlayers();

                    this.allGamesInfo(playersKeys);

                    playersKeys.forEach(function (playerKey) {
                        this._connections[playerKey].sendUTF(this.sendMessage("preparationStarted", {
                            playerKey: key,
                            gameKey: gameKey
                        }));
                    }.bind(this));
                    break;

                case "leaveGame":
                    this.leaveGame(messageData.message.playerKey, messageData.message.gameKey);
                    break;

                case "addShip":
                    var game = this._games[messageData.message.gameKey];
                    game.addShip(key, messageData.message.type, messageData.message.vertical, messageData.message.x, messageData.message.y);
                    break;

                case "setPlayerReady":
                    var game = this._games[messageData.message.gameKey];
                    console.log('game ' + game);
                    game.setPlayerReady(key, true);


                    if (game.arePlayersReady()) {
                        console.log('ready');
                        var currentPlayerKey = key;
                        var enemyPlayerKey = game.getEnemyPlayerKey(key);
                        var currentPlayer = game.getPlayer(currentPlayerKey);
                        var enemyPlayer = game.getPlayer(enemyPlayerKey);

                        this._connections[currentPlayerKey].sendUTF(this.sendMessage("gameStarted", {
                            onTurn: currentPlayer._onTurn,
                            enemyShips: enemyPlayer._ships
                        }));
                        this._connections[enemyPlayerKey].sendUTF(this.sendMessage("gameStarted", {
                            onTurn: enemyPlayer._onTurn,
                            enemyShips: currentPlayer._ships
                        }));
                    }
                    
                    // TODO check if enemy is ready and then set gameReady to true and first player
                    break;

                case "playerShot":
                    var game = this._games[messageData.message.gameKey];
                    var currentPlayerKey = key;
                    var enemyPlayerKey = game.getEnemyPlayerKey(key);
                    var currentPlayer = game.getPlayer(currentPlayerKey);
                    var enemyPlayer = game.getPlayer(enemyPlayerKey);

                    this._connections[enemyPlayerKey].sendUTF(this.sendMessage("markShot", {
                        onTurn: true,
                        x: messageData.message.x,
                        y: messageData.message.y
                    }));
                    break;

                case "getGameList":
                    this.allGamesInfo([]);
                    break;
    
            }
        } catch (e) {
            console.log(e);
        }
    },

    addConnection: function (connection) {
        var key = Math.random().toString(36).slice(2);
        this._connections[key] = connection;
        console.log("connected", key);

        return key;
    },

    leaveGame: function (playerKey, gameKey) {

        var playersKeys = this._games[gameKey].getPlayers();
        playersKeys.forEach(function (playerKey) {
            // fixed server crash
            this._connections[playerKey].sendUTF(this.sendMessage("disconnect", true));
        }.bind(this));

        delete this._games[gameKey];
    },

    removeConnection: function (playerKey) {

        console.log("disconnected", playerKey);

        for (var gameKey in this._games) {

            var playersKeys = this._games[gameKey].getPlayers();
            if (playersKeys.indexOf(playerKey) != -1) {
                this.leaveGame(playerKey, gameKey);
            }
        }

        delete this._connections[playerKey];
    },

    sendMessage: function (type, obj) {

        return JSON.stringify({
            type: 'message',
            data: {
                messageType: type,
                message: obj
            }
        });
    },

    getVersion: function () {

        return packageJson.version;
    },

    allGamesInfo: function (excludedPlayers) {
        excludedPlayers = excludedPlayers || [];
        var gamesInfo = [];
        for (var gameKey in this._games) {
            if (!this._games[gameKey].getInfo().isPlaying) {
                gamesInfo.push(this._games[gameKey].getInfo());
            }
        }
        console.log(gamesInfo);
        for (var connectionKey in this._connections) {
            if (excludedPlayers.indexOf(connectionKey) == -1) {
                this._connections[connectionKey].sendUTF(this.sendMessage("allGames", gamesInfo));
            }
        }
    }
};

module.exports = GamesManagement;