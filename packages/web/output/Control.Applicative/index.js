"use strict";
var Control_Apply = require("../Control.Apply/index.js");
var Data_Unit = require("../Data.Unit/index.js");

// | The `Applicative` type class extends the [`Apply`](#apply) type class
// | with a `pure` function, which can be used to create values of type `f a`
// | from values of type `a`.
// |
// | Where [`Apply`](#apply) provides the ability to lift functions of two or
// | more arguments to functions whose arguments are wrapped using `f`, and
// | [`Functor`](#functor) provides the ability to lift functions of one
// | argument, `pure` can be seen as the function which lifts functions of
// | _zero_ arguments. That is, `Applicative` functors support a lifting
// | operation for any number of function arguments.
// |
// | Instances must satisfy the following laws in addition to the `Apply`
// | laws:
// |
// | - Identity: `(pure identity) <*> v = v`
// | - Composition: `pure (<<<) <*> f <*> g <*> h = f <*> (g <*> h)`
// | - Homomorphism: `(pure f) <*> (pure x) = pure (f x)`
// | - Interchange: `u <*> (pure y) = (pure (_ $ y)) <*> u`
var Applicative = function (Apply0, pure) {
    this.Apply0 = Apply0;
    this.pure = pure;
};
var pure = function (dict) {
    return dict.pure;
};

// | Perform an applicative action unless a condition is true.
var unless = function (dictApplicative) {
    return function (v) {
        return function (v1) {
            if (!v) {
                return v1;
            };
            if (v) {
                return pure(dictApplicative)(Data_Unit.unit);
            };
            throw new Error("Failed pattern match at Control.Applicative (line 62, column 1 - line 62, column 65): " + [ v.constructor.name, v1.constructor.name ]);
        };
    };
};

// | Perform an applicative action when a condition is true.
var when = function (dictApplicative) {
    return function (v) {
        return function (v1) {
            if (v) {
                return v1;
            };
            if (!v) {
                return pure(dictApplicative)(Data_Unit.unit);
            };
            throw new Error("Failed pattern match at Control.Applicative (line 57, column 1 - line 57, column 63): " + [ v.constructor.name, v1.constructor.name ]);
        };
    };
};

// | `liftA1` provides a default implementation of `(<$>)` for any
// | [`Applicative`](#applicative) functor, without using `(<$>)` as provided
// | by the [`Functor`](#functor)-[`Applicative`](#applicative) superclass
// | relationship.
// |
// | `liftA1` can therefore be used to write [`Functor`](#functor) instances
// | as follows:
// |
// | ```purescript
// | instance functorF :: Functor F where
// |   map = liftA1
// | ```
var liftA1 = function (dictApplicative) {
    return function (f) {
        return function (a) {
            return Control_Apply.apply(dictApplicative.Apply0())(pure(dictApplicative)(f))(a);
        };
    };
};
var applicativeFn = new Applicative(function () {
    return Control_Apply.applyFn;
}, function (x) {
    return function (v) {
        return x;
    };
});
var applicativeArray = new Applicative(function () {
    return Control_Apply.applyArray;
}, function (x) {
    return [ x ];
});
module.exports = {
    Applicative: Applicative,
    pure: pure,
    liftA1: liftA1,
    unless: unless,
    when: when,
    applicativeFn: applicativeFn,
    applicativeArray: applicativeArray
};
