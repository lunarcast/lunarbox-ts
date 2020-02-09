"use strict";
var Control_Applicative = require("../Control.Applicative/index.js");
var Control_Plus = require("../Control.Plus/index.js");

// | The `Alternative` type class has no members of its own; it just specifies
// | that the type constructor has both `Applicative` and `Plus` instances.
// |
// | Types which have `Alternative` instances should also satisfy the following
// | laws:
// |
// | - Distributivity: `(f <|> g) <*> x == (f <*> x) <|> (g <*> x)`
// | - Annihilation: `empty <*> f = empty`
var Alternative = function (Applicative0, Plus1) {
    this.Applicative0 = Applicative0;
    this.Plus1 = Plus1;
};
var alternativeArray = new Alternative(function () {
    return Control_Applicative.applicativeArray;
}, function () {
    return Control_Plus.plusArray;
});
module.exports = {
    Alternative: Alternative,
    alternativeArray: alternativeArray
};
