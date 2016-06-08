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

    addPlayer: function (key, onTurn) {
        this._players.push(new Player(key, [], false, onTurn));
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
        this._players.forEach((player) => {
            result.push(player._playerKey);
        });

        return result;
    },

    addShip: function (playerKey, type, vertical, x, y) {
        var player = this.getPlayer(playerKey);
        player.addShip(type, vertical, x, y);
    },

    setPlayerReady: function (playerKey, ready) {
        var player = this.getPlayer(playerKey);
        player.setReady(ready);
    },

    arePlayersReady: function () {
        if (this._players.length != 2) return false;

        for (var player of this._players) {
            if (!player._ready) return false;
        }

        return true;
    },

    getEnemyPlayerKey: function(currentPlayerKey) {
        for (var player of this._players) {
            if (player._playerKey != currentPlayerKey) return player._playerKey;
        }
        return null;
    },

    getPlayer: function (playerKey) {
        for (var player of this._players) {
            if (player._playerKey === playerKey) {
                return player;
            }
        }
    }
};

module.exports = Game;