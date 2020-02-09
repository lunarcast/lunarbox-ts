"use strict";
var $foreign = require("./foreign.js");
var Control_Category = require("../Control.Category/index.js");
var Data_Function = require("../Data.Function/index.js");
var Data_Functor = require("../Data.Functor/index.js");

// | The `Apply` class provides the `(<*>)` which is used to apply a function
// | to an argument under a type constructor.
// |
// | `Apply` can be used to lift functions of two or more arguments to work on
// | values wrapped with the type constructor `f`. It might also be understood
// | in terms of the `lift2` function:
// |
// | ```purescript
// | lift2 :: forall f a b c. Apply f => (a -> b -> c) -> f a -> f b -> f c
// | lift2 f a b = f <$> a <*> b
// | ```
// |
// | `(<*>)` is recovered from `lift2` as `lift2 ($)`. That is, `(<*>)` lifts
// | the function application operator `($)` to arguments wrapped with the
// | type constructor `f`.
// |
// | Instances must satisfy the following law in addition to the `Functor`
// | laws:
// |
// | - Associative composition: `(<<<) <$> f <*> g <*> h = f <*> (g <*> h)`
// |
// | Formally, `Apply` represents a strong lax semi-monoidal endofunctor.
var Apply = function (Functor0, apply) {
    this.Functor0 = Functor0;
    this.apply = apply;
};
var applyFn = new Apply(function () {
    return Data_Functor.functorFn;
}, function (f) {
    return function (g) {
        return function (x) {
            return f(x)(g(x));
        };
    };
});
var applyArray = new Apply(function () {
    return Data_Functor.functorArray;
}, $foreign.arrayApply);
var apply = function (dict) {
    return dict.apply;
};

// | Combine two effectful actions, keeping only the result of the first.
var applyFirst = function (dictApply) {
    return function (a) {
        return function (b) {
            return apply(dictApply)(Data_Functor.map(dictApply.Functor0())(Data_Function["const"])(a))(b);
        };
    };
};

// | Combine two effectful actions, keeping only the result of the second.
var applySecond = function (dictApply) {
    return function (a) {
        return function (b) {
            return apply(dictApply)(Data_Functor.map(dictApply.Functor0())(Data_Function["const"](Control_Category.identity(Control_Category.categoryFn)))(a))(b);
        };
    };
};

// | Lift a function of two arguments to a function which accepts and returns
// | values wrapped with the type constructor `f`.
var lift2 = function (dictApply) {
    return function (f) {
        return function (a) {
            return function (b) {
                return apply(dictApply)(Data_Functor.map(dictApply.Functor0())(f)(a))(b);
            };
        };
    };
};

// | Lift a function of three arguments to a function which accepts and returns
// | values wrapped with the type constructor `f`.
var lift3 = function (dictApply) {
    return function (f) {
        return function (a) {
            return function (b) {
                return function (c) {
                    return apply(dictApply)(apply(dictApply)(Data_Functor.map(dictApply.Functor0())(f)(a))(b))(c);
                };
            };
        };
    };
};

// | Lift a function of four arguments to a function which accepts and returns
// | values wrapped with the type constructor `f`.
var lift4 = function (dictApply) {
    return function (f) {
        return function (a) {
            return function (b) {
                return function (c) {
                    return function (d) {
                        return apply(dictApply)(apply(dictApply)(apply(dictApply)(Data_Functor.map(dictApply.Functor0())(f)(a))(b))(c))(d);
                    };
                };
            };
        };
    };
};

// | Lift a function of five arguments to a function which accepts and returns
// | values wrapped with the type constructor `f`.
var lift5 = function (dictApply) {
    return function (f) {
        return function (a) {
            return function (b) {
                return function (c) {
                    return function (d) {
                        return function (e) {
                            return apply(dictApply)(apply(dictApply)(apply(dictApply)(apply(dictApply)(Data_Functor.map(dictApply.Functor0())(f)(a))(b))(c))(d))(e);
                        };
                    };
                };
            };
        };
    };
};
module.exports = {
    Apply: Apply,
    apply: apply,
    applyFirst: applyFirst,
    applySecond: applySecond,
    lift2: lift2,
    lift3: lift3,
    lift4: lift4,
    lift5: lift5,
    applyFn: applyFn,
    applyArray: applyArray
};
