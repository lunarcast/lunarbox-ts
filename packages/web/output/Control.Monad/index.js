"use strict";
var Control_Applicative = require("../Control.Applicative/index.js");
var Control_Bind = require("../Control.Bind/index.js");

// | The `Monad` type class combines the operations of the `Bind` and
// | `Applicative` type classes. Therefore, `Monad` instances represent type
// | constructors which support sequential composition, and also lifting of
// | functions of arbitrary arity.
// |
// | Instances must satisfy the following laws in addition to the
// | `Applicative` and `Bind` laws:
// |
// | - Left Identity: `pure x >>= f = f x`
// | - Right Identity: `x >>= pure = x`
// | - Applicative Superclass: `apply = ap`
var Monad = function (Applicative0, Bind1) {
    this.Applicative0 = Applicative0;
    this.Bind1 = Bind1;
};

// | Perform a monadic action when a condition is true, where the conditional
// | value is also in a monadic context.
var whenM = function (dictMonad) {
    return function (mb) {
        return function (m) {
            return Control_Bind.bind(dictMonad.Bind1())(mb)(function (b) {
                return Control_Applicative.when(dictMonad.Applicative0())(b)(m);
            });
        };
    };
};

// | Perform a monadic action unless a condition is true, where the conditional
// | value is also in a monadic context.
var unlessM = function (dictMonad) {
    return function (mb) {
        return function (m) {
            return Control_Bind.bind(dictMonad.Bind1())(mb)(function (b) {
                return Control_Applicative.unless(dictMonad.Applicative0())(b)(m);
            });
        };
    };
};
var monadFn = new Monad(function () {
    return Control_Applicative.applicativeFn;
}, function () {
    return Control_Bind.bindFn;
});
var monadArray = new Monad(function () {
    return Control_Applicative.applicativeArray;
}, function () {
    return Control_Bind.bindArray;
});

// | `liftM1` provides a default implementation of `(<$>)` for any
// | [`Monad`](#monad), without using `(<$>)` as provided by the
// | [`Functor`](#functor)-[`Monad`](#monad) superclass relationship.
// |
// | `liftM1` can therefore be used to write [`Functor`](#functor) instances
// | as follows:
// |
// | ```purescript
// | instance functorF :: Functor F where
// |   map = liftM1
// | ```
var liftM1 = function (dictMonad) {
    return function (f) {
        return function (a) {
            return Control_Bind.bind(dictMonad.Bind1())(a)(function (a$prime) {
                return Control_Applicative.pure(dictMonad.Applicative0())(f(a$prime));
            });
        };
    };
};

// | `ap` provides a default implementation of `(<*>)` for any
// | [`Monad`](#monad), without using `(<*>)` as provided by the
// | [`Apply`](#apply)-[`Monad`](#monad) superclass relationship.
// |
// | `ap` can therefore be used to write [`Apply`](#apply) instances as
// | follows:
// |
// | ```purescript
// | instance applyF :: Apply F where
// |   apply = ap
// | ```
var ap = function (dictMonad) {
    return function (f) {
        return function (a) {
            return Control_Bind.bind(dictMonad.Bind1())(f)(function (f$prime) {
                return Control_Bind.bind(dictMonad.Bind1())(a)(function (a$prime) {
                    return Control_Applicative.pure(dictMonad.Applicative0())(f$prime(a$prime));
                });
            });
        };
    };
};
module.exports = {
    Monad: Monad,
    liftM1: liftM1,
    ap: ap,
    whenM: whenM,
    unlessM: unlessM,
    monadFn: monadFn,
    monadArray: monadArray
};
