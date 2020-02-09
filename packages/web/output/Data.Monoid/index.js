"use strict";
var Data_Boolean = require("../Data.Boolean/index.js");
var Data_EuclideanRing = require("../Data.EuclideanRing/index.js");
var Data_Ordering = require("../Data.Ordering/index.js");
var Data_Semigroup = require("../Data.Semigroup/index.js");
var Data_Symbol = require("../Data.Symbol/index.js");
var Data_Unit = require("../Data.Unit/index.js");
var Record_Unsafe = require("../Record.Unsafe/index.js");
var Type_Data_RowList = require("../Type.Data.RowList/index.js");

// | A class for records where all fields have `Monoid` instances, used to
// | implement the `Monoid` instance for records.
var MonoidRecord = function (SemigroupRecord0, memptyRecord) {
    this.SemigroupRecord0 = SemigroupRecord0;
    this.memptyRecord = memptyRecord;
};

// | A `Monoid` is a `Semigroup` with a value `mempty`, which is both a
// | left and right unit for the associative operation `<>`:
// |
// | - Left unit: `(mempty <> x) = x`
// | - Right unit: `(x <> mempty) = x`
// |
// | `Monoid`s are commonly used as the result of fold operations, where
// | `<>` is used to combine individual results, and `mempty` gives the result
// | of folding an empty collection of elements.
var Monoid = function (Semigroup0, mempty) {
    this.Semigroup0 = Semigroup0;
    this.mempty = mempty;
};
var monoidUnit = new Monoid(function () {
    return Data_Semigroup.semigroupUnit;
}, Data_Unit.unit);
var monoidString = new Monoid(function () {
    return Data_Semigroup.semigroupString;
}, "");
var monoidRecordNil = new MonoidRecord(function () {
    return Data_Semigroup.semigroupRecordNil;
}, function (v) {
    return {};
});
var monoidOrdering = new Monoid(function () {
    return Data_Ordering.semigroupOrdering;
}, Data_Ordering.EQ.value);
var monoidArray = new Monoid(function () {
    return Data_Semigroup.semigroupArray;
}, [  ]);
var memptyRecord = function (dict) {
    return dict.memptyRecord;
};
var monoidRecord = function (dictRowToList) {
    return function (dictMonoidRecord) {
        return new Monoid(function () {
            return Data_Semigroup.semigroupRecord()(dictMonoidRecord.SemigroupRecord0());
        }, memptyRecord(dictMonoidRecord)(Type_Data_RowList.RLProxy.value));
    };
};
var mempty = function (dict) {
    return dict.mempty;
};
var monoidFn = function (dictMonoid) {
    return new Monoid(function () {
        return Data_Semigroup.semigroupFn(dictMonoid.Semigroup0());
    }, function (v) {
        return mempty(dictMonoid);
    });
};
var monoidRecordCons = function (dictIsSymbol) {
    return function (dictMonoid) {
        return function (dictCons) {
            return function (dictMonoidRecord) {
                return new MonoidRecord(function () {
                    return Data_Semigroup.semigroupRecordCons(dictIsSymbol)()(dictMonoidRecord.SemigroupRecord0())(dictMonoid.Semigroup0());
                }, function (v) {
                    var tail = memptyRecord(dictMonoidRecord)(Type_Data_RowList.RLProxy.value);
                    var key = Data_Symbol.reflectSymbol(dictIsSymbol)(Data_Symbol.SProxy.value);
                    var insert = Record_Unsafe.unsafeSet(key);
                    return insert(mempty(dictMonoid))(tail);
                });
            };
        };
    };
};

// | Append a value to itself a certain number of times. For the
// | `Multiplicative` type, and for a non-negative power, this is the same as
// | normal number exponentiation.
// |
// | If the second argument is negative this function will return `mempty`
// | (*unlike* normal number exponentiation). The `Monoid` constraint alone
// | is not enough to write a `power` function with the property that `power x
// | n` cancels with `power x (-n)`, i.e. `power x n <> power x (-n) = mempty`.
// | For that, we would additionally need the ability to invert elements, i.e.
// | a Group.
var power = function (dictMonoid) {
    return function (x) {
        var go = function (p) {
            if (p <= 0) {
                return mempty(dictMonoid);
            };
            if (p === 1) {
                return x;
            };
            if (Data_EuclideanRing.mod(Data_EuclideanRing.euclideanRingInt)(p)(2) === 0) {
                var x$prime = go(Data_EuclideanRing.div(Data_EuclideanRing.euclideanRingInt)(p)(2));
                return Data_Semigroup.append(dictMonoid.Semigroup0())(x$prime)(x$prime);
            };
            if (Data_Boolean.otherwise) {
                var x$prime = go(Data_EuclideanRing.div(Data_EuclideanRing.euclideanRingInt)(p)(2));
                return Data_Semigroup.append(dictMonoid.Semigroup0())(x$prime)(Data_Semigroup.append(dictMonoid.Semigroup0())(x$prime)(x));
            };
            throw new Error("Failed pattern match at Data.Monoid (line 65, column 3 - line 65, column 17): " + [ p.constructor.name ]);
        };
        return go;
    };
};

// | Allow or "truncate" a Monoid to its `mempty` value based on a condition.
var guard = function (dictMonoid) {
    return function (v) {
        return function (v1) {
            if (v) {
                return v1;
            };
            if (!v) {
                return mempty(dictMonoid);
            };
            throw new Error("Failed pattern match at Data.Monoid (line 73, column 1 - line 73, column 49): " + [ v.constructor.name, v1.constructor.name ]);
        };
    };
};
module.exports = {
    Monoid: Monoid,
    mempty: mempty,
    power: power,
    guard: guard,
    MonoidRecord: MonoidRecord,
    memptyRecord: memptyRecord,
    monoidUnit: monoidUnit,
    monoidOrdering: monoidOrdering,
    monoidFn: monoidFn,
    monoidString: monoidString,
    monoidArray: monoidArray,
    monoidRecord: monoidRecord,
    monoidRecordNil: monoidRecordNil,
    monoidRecordCons: monoidRecordCons
};
