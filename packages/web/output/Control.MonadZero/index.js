"use strict";
var Control_Alternative = require("../Control.Alternative/index.js");
var Control_Applicative = require("../Control.Applicative/index.js");
var Control_Monad = require("../Control.Monad/index.js");
var Control_Plus = require("../Control.Plus/index.js");
var Data_Unit = require("../Data.Unit/index.js");

// | The `MonadZero` type class has no members of its own; it just specifies
// | that the type has both `Monad` and `Alternative` instances.
// |
// | Types which have `MonadZero` instances should also satisfy the following
// | laws:
// |
// | - Annihilation: `empty >>= f = empty`
var MonadZero = function (Alternative1, Monad0) {
    this.Alternative1 = Alternative1;
    this.Monad0 = Monad0;
};
var monadZeroArray = new MonadZero(function () {
    return Control_Alternative.alternativeArray;
}, function () {
    return Control_Monad.monadArray;
});

// | Fail using `Plus` if a condition does not hold, or
// | succeed using `Monad` if it does.
// |
// | For example:
// |
// | ```purescript
// | import Prelude
// | import Control.Monad (bind)
// | import Control.MonadZero (guard)
// | import Data.Array ((..))
// |
// | factors :: Int -> Array Int
// | factors n = do
// |   a <- 1..n
// |   b <- 1..n
// |   guard $ a * b == n
// |   pure a
// | ```
var guard = function (dictMonadZero) {
    return function (v) {
        if (v) {
            return Control_Applicative.pure((dictMonadZero.Alternative1()).Applicative0())(Data_Unit.unit);
        };
        if (!v) {
            return Control_Plus.empty((dictMonadZero.Alternative1()).Plus1());
        };
        throw new Error("Failed pattern match at Control.MonadZero (line 54, column 1 - line 54, column 52): " + [ v.constructor.name ]);
    };
};
module.exports = {
    MonadZero: MonadZero,
    guard: guard,
    monadZeroArray: monadZeroArray
};
