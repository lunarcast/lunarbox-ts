"use strict";
var $foreign = require("./foreign.js");

// | A value-level proxy for a type-level symbol.
var SProxy = (function () {
    function SProxy() {

    };
    SProxy.value = new SProxy();
    return SProxy;
})();

// | A class for known symbols
var IsSymbol = function (reflectSymbol) {
    this.reflectSymbol = reflectSymbol;
};
var reifySymbol = function (s) {
    return function (f) {
        return $foreign.unsafeCoerce(function (dictIsSymbol) {
            return f(dictIsSymbol);
        })({
            reflectSymbol: function (v) {
                return s;
            }
        })(SProxy.value);
    };
};
var reflectSymbol = function (dict) {
    return dict.reflectSymbol;
};
module.exports = {
    IsSymbol: IsSymbol,
    reflectSymbol: reflectSymbol,
    reifySymbol: reifySymbol,
    SProxy: SProxy
};
