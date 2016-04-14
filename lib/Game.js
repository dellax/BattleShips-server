"use strict";

var Player = require('./Player');

function Game(gameKey) {

    this._size = {
        width: 10,
        height: 10
    };
    this._players = [];
    this._hits = [];
    this._gameKey = gameKey;
}

Game.prototype = {
    constructor: Game,
    addPlayer: function (key) {

        this._players[key] = new Player();
    },
    getGameState: function () {
        var allShips = [];

        this._players.forEach(function (player) {

            allShips.push(player.getShips());
        });

        return {
            size: this._size,
            ships: allShips,
            hits: this._hits
        }
    },
    getInfo: function () {

        return {
            isPlaying: this._players.length === 2,
            gameKey: this._gameKey
        };
    },
    getPlayers: function () {

        var result = [];
        for (var playerKey in this._players) {
            result.push(playerKey);
        }

        return result;
    },
    addShip: function (playerKey, type, x, y) {

        this._players[playerKey].addShip(type, x, y);
    }
};

module.exports = Game;