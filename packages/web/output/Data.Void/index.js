"use strict";
var Data_Show = require("../Data.Show/index.js");

// | An uninhabited data type.
// |
// | `Void` is useful to eliminate the possibility of a value being created.
// | For example, a value of type `Either Void Boolean` can never have
// | a Left value created in PureScript.
var Void = function (x) {
    return x;
};

// | Eliminator for the `Void` type.
// | Useful for stating that some code branch is impossible because you've
// | "acquired" a value of type `Void` (which you can't).
// |
// | ```purescript
// | rightOnly :: forall t . Either Void t -> t
// | rightOnly (Left v) = absurd v
// | rightOnly (Right t) = t
// | ```
var absurd = function (a) {
    var spin = function ($copy_v) {
        var $tco_result;
        function $tco_loop(v) {
            $copy_v = v;
            return;
        };
        while (!false) {
            $tco_result = $tco_loop($copy_v);
        };
        return $tco_result;
    };
    return spin(a);
};
var showVoid = new Data_Show.Show(absurd);
module.exports = {
    absurd: absurd,
    showVoid: showVoid
};
