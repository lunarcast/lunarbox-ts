"use strict";

// | A `Semigroupoid` is similar to a [`Category`](#category) but does not
// | require an identity element `identity`, just composable morphisms.
// |
// | `Semigroupoid`s must satisfy the following law:
// |
// | - Associativity: `p <<< (q <<< r) = (p <<< q) <<< r`
// |
// | One example of a `Semigroupoid` is the function type constructor `(->)`,
// | with `(<<<)` defined as function composition.
var Semigroupoid = function (compose) {
    this.compose = compose;
};
var semigroupoidFn = new Semigroupoid(function (f) {
    return function (g) {
        return function (x) {
            return f(g(x));
        };
    };
});
var compose = function (dict) {
    return dict.compose;
};

// | Forwards composition, or `compose` with its arguments reversed.
var composeFlipped = function (dictSemigroupoid) {
    return function (f) {
        return function (g) {
            return compose(dictSemigroupoid)(g)(f);
        };
    };
};
module.exports = {
    compose: compose,
    Semigroupoid: Semigroupoid,
    composeFlipped: composeFlipped,
    semigroupoidFn: semigroupoidFn
};
