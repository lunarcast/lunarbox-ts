"use strict";
var $foreign = require("./foreign.js");
var Data_Ord = require("../Data.Ord/index.js");
var Data_Ordering = require("../Data.Ordering/index.js");
var Data_Unit = require("../Data.Unit/index.js");

// | The `Bounded` type class represents totally ordered types that have an
// | upper and lower boundary.
// |
// | Instances should satisfy the following law in addition to the `Ord` laws:
// |
// | - Bounded: `bottom <= a <= top`
var Bounded = function (Ord0, bottom, top) {
    this.Ord0 = Ord0;
    this.bottom = bottom;
    this.top = top;
};
var top = function (dict) {
    return dict.top;
};
var boundedUnit = new Bounded(function () {
    return Data_Ord.ordUnit;
}, Data_Unit.unit, Data_Unit.unit);
var boundedOrdering = new Bounded(function () {
    return Data_Ord.ordOrdering;
}, Data_Ordering.LT.value, Data_Ordering.GT.value);
var boundedNumber = new Bounded(function () {
    return Data_Ord.ordNumber;
}, $foreign.bottomNumber, $foreign.topNumber);

// | The `Bounded` `Int` instance has `top :: Int` equal to 2^31 - 1,
// | and `bottom :: Int` equal to -2^31, since these are the largest and smallest
// | integers representable by twos-complement 32-bit integers, respectively.
var boundedInt = new Bounded(function () {
    return Data_Ord.ordInt;
}, $foreign.bottomInt, $foreign.topInt);

// | Characters fall within the Unicode range.
var boundedChar = new Bounded(function () {
    return Data_Ord.ordChar;
}, $foreign.bottomChar, $foreign.topChar);
var boundedBoolean = new Bounded(function () {
    return Data_Ord.ordBoolean;
}, false, true);
var bottom = function (dict) {
    return dict.bottom;
};
module.exports = {
    Bounded: Bounded,
    bottom: bottom,
    top: top,
    boundedBoolean: boundedBoolean,
    boundedInt: boundedInt,
    boundedChar: boundedChar,
    boundedOrdering: boundedOrdering,
    boundedUnit: boundedUnit,
    boundedNumber: boundedNumber
};
