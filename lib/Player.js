"use strict";

var Ship = require('./Ship');

function Player(playerKey, ships, ready, onTurn) {
    this._playerKey = playerKey
    this._ships = ships;
    this._ready = ready;
    this._onTurn = onTurn;
}

Player.prototype = {
    constructor: Player,

    getShips: function () {
        return this._ships;
    },

    addShip: function (type, vertical, x, y) {
        this._ships.push({
            type: type,
            vertical: vertical,
            x: x,
            y: y
        });

    },

    setReady: function (ready) {
        this._ready = ready;
    },

};

module.exports = Player;