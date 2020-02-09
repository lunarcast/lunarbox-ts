"use strict";
var $foreign = require("./foreign.js");
var Control_Category = require("../Control.Category/index.js");
var Data_Functor = require("../Data.Functor/index.js");
var Data_Semigroup = require("../Data.Semigroup/index.js");

// | The `Extend` class defines the extension operator `(<<=)`
// | which extends a local context-dependent computation to
// | a global computation.
// |
// | `Extend` is the dual of `Bind`, and `(<<=)` is the dual of
// | `(>>=)`.
// |
// | Laws:
// |
// | - Associativity: `extend f <<< extend g = extend (f <<< extend g)`
var Extend = function (Functor0, extend) {
    this.Functor0 = Functor0;
    this.extend = extend;
};
var extendFn = function (dictSemigroup) {
    return new Extend(function () {
        return Data_Functor.functorFn;
    }, function (f) {
        return function (g) {
            return function (w) {
                return f(function (w$prime) {
                    return g(Data_Semigroup.append(dictSemigroup)(w)(w$prime));
                });
            };
        };
    });
};
var extendArray = new Extend(function () {
    return Data_Functor.functorArray;
}, $foreign.arrayExtend);
var extend = function (dict) {
    return dict.extend;
};

// | A version of `extend` with its arguments flipped.
var extendFlipped = function (dictExtend) {
    return function (w) {
        return function (f) {
            return extend(dictExtend)(f)(w);
        };
    };
};

// | Duplicate a comonadic context.
// |
// | `duplicate` is dual to `Control.Bind.join`.
var duplicate = function (dictExtend) {
    return extend(dictExtend)(Control_Category.identity(Control_Category.categoryFn));
};

// | Backwards co-Kleisli composition.
var composeCoKleisliFlipped = function (dictExtend) {
    return function (f) {
        return function (g) {
            return function (w) {
                return f(extend(dictExtend)(g)(w));
            };
        };
    };
};

// | Forwards co-Kleisli composition.
var composeCoKleisli = function (dictExtend) {
    return function (f) {
        return function (g) {
            return function (w) {
                return g(extend(dictExtend)(f)(w));
            };
        };
    };
};
module.exports = {
    Extend: Extend,
    extend: extend,
    extendFlipped: extendFlipped,
    composeCoKleisli: composeCoKleisli,
    composeCoKleisliFlipped: composeCoKleisliFlipped,
    duplicate: duplicate,
    extendFn: extendFn,
    extendArray: extendArray
};
