"use strict";
var $foreign = require("./foreign.js");
var Data_Show = require("../Data.Show/index.js");
var showUnit = new Data_Show.Show(function (v) {
    return "unit";
});
module.exports = {
    showUnit: showUnit,
    unit: $foreign.unit
};
