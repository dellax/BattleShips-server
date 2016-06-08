"use strict";

var Ship = require('./Ship');

function Player() {

    this._ships = [];
    this._ready = false;
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

    }
};

module.exports = Player;