"use strict";
var Control_Apply = require("../Control.Apply/index.js");
var Control_Bind = require("../Control.Bind/index.js");
var Data_Maybe = require("../Data.Maybe/index.js");
var Constant = (function () {
    function Constant(value0) {
        this.value0 = value0;
    };
    Constant.create = function (value0) {
        return new Constant(value0);
    };
    return Constant;
})();
var Arrow = (function () {
    function Arrow(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Arrow.create = function (value0) {
        return function (value1) {
            return new Arrow(value0, value1);
        };
    };
    return Arrow;
})();
var Pipe = (function () {
    function Pipe(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Pipe.create = function (value0) {
        return function (value1) {
            return new Pipe(value0, value1);
        };
    };
    return Pipe;
})();
var nothing = Data_Maybe.Nothing.value;
var nodeValue = function (node) {
    if (node instanceof Constant) {
        return new Data_Maybe.Just(node.value0);
    };
    if (node instanceof Arrow) {
        return Control_Bind.bind(Data_Maybe.bindMaybe)(nodeValue(node.value0))(node.value1);
    };
    if (node instanceof Pipe) {
        return Control_Bind.join(Data_Maybe.bindMaybe)(Control_Apply.apply(Data_Maybe.applyMaybe)(nodeValue(node.value1))(nodeValue(node.value0)));
    };
    throw new Error("Failed pattern match at Main (line 19, column 18 - line 22, column 67): " + [ node.constructor.name ]);
};

// Reexports are not supported so I have to do this
var just = Data_Maybe.Just.create;
module.exports = {
    just: just,
    nothing: nothing,
    Constant: Constant,
    Arrow: Arrow,
    Pipe: Pipe,
    nodeValue: nodeValue
};
