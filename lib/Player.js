"use strict";

var Ship = require('./Ship');

function Player() {

    this._ships = [];
}

Player.prototype = {
    constructor: Player,
    getShips: function () {

        return this._ships;
    },
    addShip: function (type, x, y) {

        this._ships.push({
            type: type,
            x: x,
            y: y
        });
    }
};

module.exports = Player;