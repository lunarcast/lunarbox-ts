"use strict";
var Data_Functor = require("../Data.Functor/index.js");
var Data_Semigroup = require("../Data.Semigroup/index.js");

// | The `Alt` type class identifies an associative operation on a type
// | constructor.  It is similar to `Semigroup`, except that it applies to
// | types of kind `* -> *`, like `Array` or `List`, rather than concrete types
// | `String` or `Number`.
// |
// | `Alt` instances are required to satisfy the following laws:
// |
// | - Associativity: `(x <|> y) <|> z == x <|> (y <|> z)`
// | - Distributivity: `f <$> (x <|> y) == (f <$> x) <|> (f <$> y)`
// |
// | For example, the `Array` (`[]`) type is an instance of `Alt`, where
// | `(<|>)` is defined to be concatenation.
var Alt = function (Functor0, alt) {
    this.Functor0 = Functor0;
    this.alt = alt;
};
var altArray = new Alt(function () {
    return Data_Functor.functorArray;
}, Data_Semigroup.append(Data_Semigroup.semigroupArray));
var alt = function (dict) {
    return dict.alt;
};
module.exports = {
    Alt: Alt,
    alt: alt,
    altArray: altArray
};
