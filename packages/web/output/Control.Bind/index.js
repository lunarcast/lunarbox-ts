"use strict";
var $foreign = require("./foreign.js");
var Control_Apply = require("../Control.Apply/index.js");
var Control_Category = require("../Control.Category/index.js");
var Data_Function = require("../Data.Function/index.js");

// | A class for types whose values can safely be discarded
// | in a `do` notation block.
// |
// | An example is the `Unit` type, since there is only one
// | possible value which can be returned.
var Discard = function (discard) {
    this.discard = discard;
};

// | The `Bind` type class extends the [`Apply`](#apply) type class with a
// | "bind" operation `(>>=)` which composes computations in sequence, using
// | the return value of one computation to determine the next computation.
// |
// | The `>>=` operator can also be expressed using `do` notation, as follows:
// |
// | ```purescript
// | x >>= f = do y <- x
// |              f y
// | ```
// |
// | where the function argument of `f` is given the name `y`.
// |
// | Instances must satisfy the following law in addition to the `Apply`
// | laws:
// |
// | - Associativity: `(x >>= f) >>= g = x >>= (\k -> f k >>= g)`
// |
// | Associativity tells us that we can regroup operations which use `do`
// | notation so that we can unambiguously write, for example:
// |
// | ```purescript
// | do x <- m1
// |    y <- m2 x
// |    m3 x y
// | ```
var Bind = function (Apply0, bind) {
    this.Apply0 = Apply0;
    this.bind = bind;
};
var discard = function (dict) {
    return dict.discard;
};
var bindFn = new Bind(function () {
    return Control_Apply.applyFn;
}, function (m) {
    return function (f) {
        return function (x) {
            return f(m(x))(x);
        };
    };
});
var bindArray = new Bind(function () {
    return Control_Apply.applyArray;
}, $foreign.arrayBind);
var bind = function (dict) {
    return dict.bind;
};

// | `bindFlipped` is `bind` with its arguments reversed. For example:
// |
// | ```purescript
// | print =<< random
// | ```
var bindFlipped = function (dictBind) {
    return Data_Function.flip(bind(dictBind));
};

// | Backwards Kleisli composition.
var composeKleisliFlipped = function (dictBind) {
    return function (f) {
        return function (g) {
            return function (a) {
                return bindFlipped(dictBind)(f)(g(a));
            };
        };
    };
};

// | Forwards Kleisli composition.
// |
// | For example:
// |
// | ```purescript
// | import Data.Array (head, tail)
// |
// | third = tail >=> tail >=> head
// | ```
var composeKleisli = function (dictBind) {
    return function (f) {
        return function (g) {
            return function (a) {
                return bind(dictBind)(f(a))(g);
            };
        };
    };
};
var discardUnit = new Discard(function (dictBind) {
    return bind(dictBind);
});

// | Execute a monadic action if a condition holds.
// |
// | For example:
// |
// | ```purescript
// | main = ifM ((< 0.5) <$> random)
// |          (trace "Heads")
// |          (trace "Tails")
// | ```
var ifM = function (dictBind) {
    return function (cond) {
        return function (t) {
            return function (f) {
                return bind(dictBind)(cond)(function (cond$prime) {
                    if (cond$prime) {
                        return t;
                    };
                    return f;
                });
            };
        };
    };
};

// | Collapse two applications of a monadic type constructor into one.
var join = function (dictBind) {
    return function (m) {
        return bind(dictBind)(m)(Control_Category.identity(Control_Category.categoryFn));
    };
};
module.exports = {
    Bind: Bind,
    bind: bind,
    bindFlipped: bindFlipped,
    Discard: Discard,
    discard: discard,
    join: join,
    composeKleisli: composeKleisli,
    composeKleisliFlipped: composeKleisliFlipped,
    ifM: ifM,
    bindFn: bindFn,
    bindArray: bindArray,
    discardUnit: discardUnit
};
