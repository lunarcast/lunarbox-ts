"use strict";
var $foreign = require("./foreign.js");
var Data_CommutativeRing = require("../Data.CommutativeRing/index.js");
var Data_Eq = require("../Data.Eq/index.js");
var Data_Semiring = require("../Data.Semiring/index.js");

// | The `EuclideanRing` class is for commutative rings that support division.
// | The mathematical structure this class is based on is sometimes also called
// | a *Euclidean domain*.
// |
// | Instances must satisfy the following laws in addition to the `Ring`
// | laws:
// |
// | - Integral domain: `one /= zero`, and if `a` and `b` are both nonzero then
// |   so is their product `a * b`
// | - Euclidean function `degree`:
// |   - Nonnegativity: For all nonzero `a`, `degree a >= 0`
// |   - Quotient/remainder: For all `a` and `b`, where `b` is nonzero,
// |     let `q = a / b` and ``r = a `mod` b``; then `a = q*b + r`, and also
// |     either `r = zero` or `degree r < degree b`
// | - Submultiplicative euclidean function:
// |   - For all nonzero `a` and `b`, `degree a <= degree (a * b)`
// |
// | The behaviour of division by `zero` is unconstrained by these laws,
// | meaning that individual instances are free to choose how to behave in this
// | case. Similarly, there are no restrictions on what the result of
// | `degree zero` is; it doesn't make sense to ask for `degree zero` in the
// | same way that it doesn't make sense to divide by `zero`, so again,
// | individual instances may choose how to handle this case.
// |
// | For any `EuclideanRing` which is also a `Field`, one valid choice
// | for `degree` is simply `const 1`. In fact, unless there's a specific
// | reason not to, `Field` types should normally use this definition of
// | `degree`.
// |
// | The `EuclideanRing Int` instance is one of the most commonly used
// | `EuclideanRing` instances and deserves a little more discussion. In
// | particular, there are a few different sensible law-abiding implementations
// | to choose from, with slightly different behaviour in the presence of
// | negative dividends or divisors. The most common definitions are "truncating"
// | division, where the result of `a / b` is rounded towards 0, and "Knuthian"
// | or "flooring" division, where the result of `a / b` is rounded towards
// | negative infinity. A slightly less common, but arguably more useful, option
// | is "Euclidean" division, which is defined so as to ensure that ``a `mod` b``
// | is always nonnegative. With Euclidean division, `a / b` rounds towards
// | negative infinity if the divisor is positive, and towards positive infinity
// | if the divisor is negative. Note that all three definitions are identical if
// | we restrict our attention to nonnegative dividends and divisors.
// |
// | In versions 1.x, 2.x, and 3.x of the Prelude, the `EuclideanRing Int`
// | instance used truncating division. As of 4.x, the `EuclideanRing Int`
// | instance uses Euclidean division. Additional functions `quot` and `rem` are
// | supplied if truncating division is desired.
var EuclideanRing = function (CommutativeRing0, degree, div, mod) {
    this.CommutativeRing0 = CommutativeRing0;
    this.degree = degree;
    this.div = div;
    this.mod = mod;
};
var mod = function (dict) {
    return dict.mod;
};

// | The *greatest common divisor* of two values.
var gcd = function ($copy_dictEq) {
    return function ($copy_dictEuclideanRing) {
        return function ($copy_a) {
            return function ($copy_b) {
                var $tco_var_dictEq = $copy_dictEq;
                var $tco_var_dictEuclideanRing = $copy_dictEuclideanRing;
                var $tco_var_a = $copy_a;
                var $tco_done = false;
                var $tco_result;
                function $tco_loop(dictEq, dictEuclideanRing, a, b) {
                    var $7 = Data_Eq.eq(dictEq)(b)(Data_Semiring.zero(((dictEuclideanRing.CommutativeRing0()).Ring0()).Semiring0()));
                    if ($7) {
                        $tco_done = true;
                        return a;
                    };
                    $tco_var_dictEq = dictEq;
                    $tco_var_dictEuclideanRing = dictEuclideanRing;
                    $tco_var_a = b;
                    $copy_b = mod(dictEuclideanRing)(a)(b);
                    return;
                };
                while (!$tco_done) {
                    $tco_result = $tco_loop($tco_var_dictEq, $tco_var_dictEuclideanRing, $tco_var_a, $copy_b);
                };
                return $tco_result;
            };
        };
    };
};
var euclideanRingNumber = new EuclideanRing(function () {
    return Data_CommutativeRing.commutativeRingNumber;
}, function (v) {
    return 1;
}, $foreign.numDiv, function (v) {
    return function (v1) {
        return 0.0;
    };
});
var euclideanRingInt = new EuclideanRing(function () {
    return Data_CommutativeRing.commutativeRingInt;
}, $foreign.intDegree, $foreign.intDiv, $foreign.intMod);
var div = function (dict) {
    return dict.div;
};

// | The *least common multiple* of two values.
var lcm = function (dictEq) {
    return function (dictEuclideanRing) {
        return function (a) {
            return function (b) {
                var $8 = Data_Eq.eq(dictEq)(a)(Data_Semiring.zero(((dictEuclideanRing.CommutativeRing0()).Ring0()).Semiring0())) || Data_Eq.eq(dictEq)(b)(Data_Semiring.zero(((dictEuclideanRing.CommutativeRing0()).Ring0()).Semiring0()));
                if ($8) {
                    return Data_Semiring.zero(((dictEuclideanRing.CommutativeRing0()).Ring0()).Semiring0());
                };
                return div(dictEuclideanRing)(Data_Semiring.mul(((dictEuclideanRing.CommutativeRing0()).Ring0()).Semiring0())(a)(b))(gcd(dictEq)(dictEuclideanRing)(a)(b));
            };
        };
    };
};
var degree = function (dict) {
    return dict.degree;
};
module.exports = {
    EuclideanRing: EuclideanRing,
    degree: degree,
    div: div,
    mod: mod,
    gcd: gcd,
    lcm: lcm,
    euclideanRingInt: euclideanRingInt,
    euclideanRingNumber: euclideanRingNumber
};
