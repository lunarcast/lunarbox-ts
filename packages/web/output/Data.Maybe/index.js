"use strict";
var Control_Alt = require("../Control.Alt/index.js");
var Control_Alternative = require("../Control.Alternative/index.js");
var Control_Applicative = require("../Control.Applicative/index.js");
var Control_Apply = require("../Control.Apply/index.js");
var Control_Bind = require("../Control.Bind/index.js");
var Control_Category = require("../Control.Category/index.js");
var Control_Extend = require("../Control.Extend/index.js");
var Control_Monad = require("../Control.Monad/index.js");
var Control_MonadZero = require("../Control.MonadZero/index.js");
var Control_Plus = require("../Control.Plus/index.js");
var Data_Bounded = require("../Data.Bounded/index.js");
var Data_Eq = require("../Data.Eq/index.js");
var Data_Function = require("../Data.Function/index.js");
var Data_Functor = require("../Data.Functor/index.js");
var Data_Functor_Invariant = require("../Data.Functor.Invariant/index.js");
var Data_Monoid = require("../Data.Monoid/index.js");
var Data_Ord = require("../Data.Ord/index.js");
var Data_Ordering = require("../Data.Ordering/index.js");
var Data_Semigroup = require("../Data.Semigroup/index.js");
var Data_Show = require("../Data.Show/index.js");
var Data_Unit = require("../Data.Unit/index.js");

// | The `Maybe` type is used to represent optional values and can be seen as
// | something like a type-safe `null`, where `Nothing` is `null` and `Just x`
// | is the non-null value `x`.
var Nothing = (function () {
    function Nothing() {

    };
    Nothing.value = new Nothing();
    return Nothing;
})();

// | The `Maybe` type is used to represent optional values and can be seen as
// | something like a type-safe `null`, where `Nothing` is `null` and `Just x`
// | is the non-null value `x`.
var Just = (function () {
    function Just(value0) {
        this.value0 = value0;
    };
    Just.create = function (value0) {
        return new Just(value0);
    };
    return Just;
})();

// | The `Show` instance allows `Maybe` values to be rendered as a string with
// | `show` whenever there is an `Show` instance for the type the `Maybe`
// | contains.
var showMaybe = function (dictShow) {
    return new Data_Show.Show(function (v) {
        if (v instanceof Just) {
            return "(Just " + (Data_Show.show(dictShow)(v.value0) + ")");
        };
        if (v instanceof Nothing) {
            return "Nothing";
        };
        throw new Error("Failed pattern match at Data.Maybe (line 205, column 1 - line 207, column 28): " + [ v.constructor.name ]);
    });
};

// | The `Semigroup` instance enables use of the operator `<>` on `Maybe` values
// | whenever there is a `Semigroup` instance for the type the `Maybe` contains.
// | The exact behaviour of `<>` depends on the "inner" `Semigroup` instance,
// | but generally captures the notion of appending or combining things.
// |
// | ``` purescript
// | Just x <> Just y = Just (x <> y)
// | Just x <> Nothing = Just x
// | Nothing <> Just y = Just y
// | Nothing <> Nothing = Nothing
// | ```
var semigroupMaybe = function (dictSemigroup) {
    return new Data_Semigroup.Semigroup(function (v) {
        return function (v1) {
            if (v instanceof Nothing) {
                return v1;
            };
            if (v1 instanceof Nothing) {
                return v;
            };
            if (v instanceof Just && v1 instanceof Just) {
                return new Just(Data_Semigroup.append(dictSemigroup)(v.value0)(v1.value0));
            };
            throw new Error("Failed pattern match at Data.Maybe (line 174, column 1 - line 177, column 43): " + [ v.constructor.name, v1.constructor.name ]);
        };
    });
};

// | One or none.
// |
// | ``` purescript
// | optional empty = pure Nothing
// | optional (pure x) = pure (Just x)
// | ```
var optional = function (dictAlternative) {
    return function (a) {
        return Control_Alt.alt((dictAlternative.Plus1()).Alt0())(Data_Functor.map(((dictAlternative.Plus1()).Alt0()).Functor0())(Just.create)(a))(Control_Applicative.pure(dictAlternative.Applicative0())(Nothing.value));
    };
};
var monoidMaybe = function (dictSemigroup) {
    return new Data_Monoid.Monoid(function () {
        return semigroupMaybe(dictSemigroup);
    }, Nothing.value);
};

// | Similar to `maybe` but for use in cases where the default value may be
// | expensive to compute. As PureScript is not lazy, the standard `maybe` has
// | to evaluate the default value before returning the result, whereas here
// | the value is only computed when the `Maybe` is known to be `Nothing`.
// |
// | ``` purescript
// | maybe' (\_ -> x) f Nothing == x
// | maybe' (\_ -> x) f (Just y) == f y
// | ```
var maybe$prime = function (v) {
    return function (v1) {
        return function (v2) {
            if (v2 instanceof Nothing) {
                return v(Data_Unit.unit);
            };
            if (v2 instanceof Just) {
                return v1(v2.value0);
            };
            throw new Error("Failed pattern match at Data.Maybe (line 230, column 1 - line 230, column 62): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
        };
    };
};

// | Takes a default value, a function, and a `Maybe` value. If the `Maybe`
// | value is `Nothing` the default value is returned, otherwise the function
// | is applied to the value inside the `Just` and the result is returned.
// |
// | ``` purescript
// | maybe x f Nothing == x
// | maybe x f (Just y) == f y
// | ```
var maybe = function (v) {
    return function (v1) {
        return function (v2) {
            if (v2 instanceof Nothing) {
                return v;
            };
            if (v2 instanceof Just) {
                return v1(v2.value0);
            };
            throw new Error("Failed pattern match at Data.Maybe (line 217, column 1 - line 217, column 51): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
        };
    };
};

// | Returns `true` when the `Maybe` value is `Nothing`.
var isNothing = maybe(true)(Data_Function["const"](false));

// | Returns `true` when the `Maybe` value was constructed with `Just`.
var isJust = maybe(false)(Data_Function["const"](true));

// | The `Functor` instance allows functions to transform the contents of a
// | `Just` with the `<$>` operator:
// |
// | ``` purescript
// | f <$> Just x == Just (f x)
// | ```
// |
// | `Nothing` values are left untouched:
// |
// | ``` purescript
// | f <$> Nothing == Nothing
// | ```
var functorMaybe = new Data_Functor.Functor(function (v) {
    return function (v1) {
        if (v1 instanceof Just) {
            return new Just(v(v1.value0));
        };
        return Nothing.value;
    };
});
var invariantMaybe = new Data_Functor_Invariant.Invariant(Data_Functor_Invariant.imapF(functorMaybe));

// | Similar to `fromMaybe` but for use in cases where the default value may be
// | expensive to compute. As PureScript is not lazy, the standard `fromMaybe`
// | has to evaluate the default value before returning the result, whereas here
// | the value is only computed when the `Maybe` is known to be `Nothing`.
// |
// | ``` purescript
// | fromMaybe' (\_ -> x) Nothing == x
// | fromMaybe' (\_ -> x) (Just y) == y
// | ```
var fromMaybe$prime = function (a) {
    return maybe$prime(a)(Control_Category.identity(Control_Category.categoryFn));
};

// | Takes a default value, and a `Maybe` value. If the `Maybe` value is
// | `Nothing` the default value is returned, otherwise the value inside the
// | `Just` is returned.
// |
// | ``` purescript
// | fromMaybe x Nothing == x
// | fromMaybe x (Just y) == y
// | ```
var fromMaybe = function (a) {
    return maybe(a)(Control_Category.identity(Control_Category.categoryFn));
};

// | A partial function that extracts the value from the `Just` data
// | constructor. Passing `Nothing` to `fromJust` will throw an error at
// | runtime.
var fromJust = function (dictPartial) {
    return function (v) {
        if (v instanceof Just) {
            return v.value0;
        };
        throw new Error("Failed pattern match at Data.Maybe (line 268, column 1 - line 268, column 46): " + [ v.constructor.name ]);
    };
};

// | The `Extend` instance allows sequencing of `Maybe` values and functions
// | that accept a `Maybe a` and return a non-`Maybe` result using the
// | `<<=` operator.
// |
// | ``` purescript
// | f <<= Nothing = Nothing
// | f <<= x = Just (f x)
// | ```
var extendMaybe = new Control_Extend.Extend(function () {
    return functorMaybe;
}, function (v) {
    return function (v1) {
        if (v1 instanceof Nothing) {
            return Nothing.value;
        };
        return new Just(v(v1));
    };
});

// | The `Eq` instance allows `Maybe` values to be checked for equality with
// | `==` and inequality with `/=` whenever there is an `Eq` instance for the
// | type the `Maybe` contains.
var eqMaybe = function (dictEq) {
    return new Data_Eq.Eq(function (x) {
        return function (y) {
            if (x instanceof Nothing && y instanceof Nothing) {
                return true;
            };
            if (x instanceof Just && y instanceof Just) {
                return Data_Eq.eq(dictEq)(x.value0)(y.value0);
            };
            return false;
        };
    });
};

// | The `Ord` instance allows `Maybe` values to be compared with
// | `compare`, `>`, `>=`, `<` and `<=` whenever there is an `Ord` instance for
// | the type the `Maybe` contains.
// |
// | `Nothing` is considered to be less than any `Just` value.
var ordMaybe = function (dictOrd) {
    return new Data_Ord.Ord(function () {
        return eqMaybe(dictOrd.Eq0());
    }, function (x) {
        return function (y) {
            if (x instanceof Nothing && y instanceof Nothing) {
                return Data_Ordering.EQ.value;
            };
            if (x instanceof Nothing) {
                return Data_Ordering.LT.value;
            };
            if (y instanceof Nothing) {
                return Data_Ordering.GT.value;
            };
            if (x instanceof Just && y instanceof Just) {
                return Data_Ord.compare(dictOrd)(x.value0)(y.value0);
            };
            throw new Error("Failed pattern match at Data.Maybe (line 194, column 1 - line 194, column 51): " + [ x.constructor.name, y.constructor.name ]);
        };
    });
};
var eq1Maybe = new Data_Eq.Eq1(function (dictEq) {
    return Data_Eq.eq(eqMaybe(dictEq));
});
var ord1Maybe = new Data_Ord.Ord1(function () {
    return eq1Maybe;
}, function (dictOrd) {
    return Data_Ord.compare(ordMaybe(dictOrd));
});
var boundedMaybe = function (dictBounded) {
    return new Data_Bounded.Bounded(function () {
        return ordMaybe(dictBounded.Ord0());
    }, Nothing.value, new Just(Data_Bounded.top(dictBounded)));
};

// | The `Apply` instance allows functions contained within a `Just` to
// | transform a value contained within a `Just` using the `apply` operator:
// |
// | ``` purescript
// | Just f <*> Just x == Just (f x)
// | ```
// |
// | `Nothing` values are left untouched:
// |
// | ``` purescript
// | Just f <*> Nothing == Nothing
// | Nothing <*> Just x == Nothing
// | ```
// |
// | Combining `Functor`'s `<$>` with `Apply`'s `<*>` can be used transform a
// | pure function to take `Maybe`-typed arguments so `f :: a -> b -> c`
// | becomes `f :: Maybe a -> Maybe b -> Maybe c`:
// |
// | ``` purescript
// | f <$> Just x <*> Just y == Just (f x y)
// | ```
// |
// | The `Nothing`-preserving behaviour of both operators means the result of
// | an expression like the above but where any one of the values is `Nothing`
// | means the whole result becomes `Nothing` also:
// |
// | ``` purescript
// | f <$> Nothing <*> Just y == Nothing
// | f <$> Just x <*> Nothing == Nothing
// | f <$> Nothing <*> Nothing == Nothing
// | ```
var applyMaybe = new Control_Apply.Apply(function () {
    return functorMaybe;
}, function (v) {
    return function (v1) {
        if (v instanceof Just) {
            return Data_Functor.map(functorMaybe)(v.value0)(v1);
        };
        if (v instanceof Nothing) {
            return Nothing.value;
        };
        throw new Error("Failed pattern match at Data.Maybe (line 67, column 1 - line 69, column 30): " + [ v.constructor.name, v1.constructor.name ]);
    };
});

// | The `Bind` instance allows sequencing of `Maybe` values and functions that
// | return a `Maybe` by using the `>>=` operator:
// |
// | ``` purescript
// | Just x >>= f = f x
// | Nothing >>= f = Nothing
// | ```
var bindMaybe = new Control_Bind.Bind(function () {
    return applyMaybe;
}, function (v) {
    return function (v1) {
        if (v instanceof Just) {
            return v1(v.value0);
        };
        if (v instanceof Nothing) {
            return Nothing.value;
        };
        throw new Error("Failed pattern match at Data.Maybe (line 125, column 1 - line 127, column 28): " + [ v.constructor.name, v1.constructor.name ]);
    };
});

// | The `Applicative` instance enables lifting of values into `Maybe` with the
// | `pure` function:
// |
// | ``` purescript
// | pure x :: Maybe _ == Just x
// | ```
// |
// | Combining `Functor`'s `<$>` with `Apply`'s `<*>` and `Applicative`'s
// | `pure` can be used to pass a mixture of `Maybe` and non-`Maybe` typed
// | values to a function that does not usually expect them, by using `pure`
// | for any value that is not already `Maybe` typed:
// |
// | ``` purescript
// | f <$> Just x <*> pure y == Just (f x y)
// | ```
// |
// | Even though `pure = Just` it is recommended to use `pure` in situations
// | like this as it allows the choice of `Applicative` to be changed later
// | without having to go through and replace `Just` with a new constructor.
var applicativeMaybe = new Control_Applicative.Applicative(function () {
    return applyMaybe;
}, Just.create);

// | The `Monad` instance guarantees that there are both `Applicative` and
// | `Bind` instances for `Maybe`. This also enables the `do` syntactic sugar:
// |
// | ``` purescript
// | do
// |   x' <- x
// |   y' <- y
// |   pure (f x' y')
// | ```
// |
// | Which is equivalent to:
// |
// | ``` purescript
// | x >>= (\x' -> y >>= (\y' -> pure (f x' y')))
// | ```
var monadMaybe = new Control_Monad.Monad(function () {
    return applicativeMaybe;
}, function () {
    return bindMaybe;
});

// | The `Alt` instance allows for a choice to be made between two `Maybe`
// | values with the `<|>` operator, where the first `Just` encountered
// | is taken.
// |
// | ``` purescript
// | Just x <|> Just y == Just x
// | Nothing <|> Just y == Just y
// | Nothing <|> Nothing == Nothing
// | ```
var altMaybe = new Control_Alt.Alt(function () {
    return functorMaybe;
}, function (v) {
    return function (v1) {
        if (v instanceof Nothing) {
            return v1;
        };
        return v;
    };
});

// | The `Plus` instance provides a default `Maybe` value:
// |
// | ``` purescript
// | empty :: Maybe _ == Nothing
// | ```
var plusMaybe = new Control_Plus.Plus(function () {
    return altMaybe;
}, Nothing.value);

// | The `Alternative` instance guarantees that there are both `Applicative` and
// | `Plus` instances for `Maybe`.
var alternativeMaybe = new Control_Alternative.Alternative(function () {
    return applicativeMaybe;
}, function () {
    return plusMaybe;
});
var monadZeroMaybe = new Control_MonadZero.MonadZero(function () {
    return alternativeMaybe;
}, function () {
    return monadMaybe;
});
module.exports = {
    Nothing: Nothing,
    Just: Just,
    maybe: maybe,
    "maybe'": maybe$prime,
    fromMaybe: fromMaybe,
    "fromMaybe'": fromMaybe$prime,
    isJust: isJust,
    isNothing: isNothing,
    fromJust: fromJust,
    optional: optional,
    functorMaybe: functorMaybe,
    applyMaybe: applyMaybe,
    applicativeMaybe: applicativeMaybe,
    altMaybe: altMaybe,
    plusMaybe: plusMaybe,
    alternativeMaybe: alternativeMaybe,
    bindMaybe: bindMaybe,
    monadMaybe: monadMaybe,
    monadZeroMaybe: monadZeroMaybe,
    extendMaybe: extendMaybe,
    invariantMaybe: invariantMaybe,
    semigroupMaybe: semigroupMaybe,
    monoidMaybe: monoidMaybe,
    eqMaybe: eqMaybe,
    eq1Maybe: eq1Maybe,
    ordMaybe: ordMaybe,
    ord1Maybe: ord1Maybe,
    boundedMaybe: boundedMaybe,
    showMaybe: showMaybe
};
