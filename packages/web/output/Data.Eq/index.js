"use strict";
var $foreign = require("./foreign.js");
var Data_Symbol = require("../Data.Symbol/index.js");
var Record_Unsafe = require("../Record.Unsafe/index.js");
var Type_Data_RowList = require("../Type.Data.RowList/index.js");

// | A class for records where all fields have `Eq` instances, used to implement
// | the `Eq` instance for records.
var EqRecord = function (eqRecord) {
    this.eqRecord = eqRecord;
};

// | The `Eq1` type class represents type constructors with decidable equality.
var Eq1 = function (eq1) {
    this.eq1 = eq1;
};

// | The `Eq` type class represents types which support decidable equality.
// |
// | `Eq` instances should satisfy the following laws:
// |
// | - Reflexivity: `x == x = true`
// | - Symmetry: `x == y = y == x`
// | - Transitivity: if `x == y` and `y == z` then `x == z`
// |
// | **Note:** The `Number` type is not an entirely law abiding member of this
// | class due to the presence of `NaN`, since `NaN /= NaN`. Additionally,
// | computing with `Number` can result in a loss of precision, so sometimes
// | values that should be equivalent are not.
var Eq = function (eq) {
    this.eq = eq;
};
var eqVoid = new Eq(function (v) {
    return function (v1) {
        return true;
    };
});
var eqUnit = new Eq(function (v) {
    return function (v1) {
        return true;
    };
});
var eqString = new Eq($foreign.eqStringImpl);
var eqRowNil = new EqRecord(function (v) {
    return function (v1) {
        return function (v2) {
            return true;
        };
    };
});
var eqRecord = function (dict) {
    return dict.eqRecord;
};
var eqRec = function (dictRowToList) {
    return function (dictEqRecord) {
        return new Eq(eqRecord(dictEqRecord)(Type_Data_RowList.RLProxy.value));
    };
};
var eqNumber = new Eq($foreign.eqNumberImpl);
var eqInt = new Eq($foreign.eqIntImpl);
var eqChar = new Eq($foreign.eqCharImpl);
var eqBoolean = new Eq($foreign.eqBooleanImpl);
var eq1 = function (dict) {
    return dict.eq1;
};
var eq = function (dict) {
    return dict.eq;
};
var eqArray = function (dictEq) {
    return new Eq($foreign.eqArrayImpl(eq(dictEq)));
};
var eq1Array = new Eq1(function (dictEq) {
    return eq(eqArray(dictEq));
});
var eqRowCons = function (dictEqRecord) {
    return function (dictCons) {
        return function (dictIsSymbol) {
            return function (dictEq) {
                return new EqRecord(function (v) {
                    return function (ra) {
                        return function (rb) {
                            var tail = eqRecord(dictEqRecord)(Type_Data_RowList.RLProxy.value)(ra)(rb);
                            var key = Data_Symbol.reflectSymbol(dictIsSymbol)(Data_Symbol.SProxy.value);
                            var get = Record_Unsafe.unsafeGet(key);
                            return eq(dictEq)(get(ra))(get(rb)) && tail;
                        };
                    };
                });
            };
        };
    };
};

// | `notEq` tests whether one value is _not equal_ to another. Shorthand for
// | `not (eq x y)`.
var notEq = function (dictEq) {
    return function (x) {
        return function (y) {
            return eq(eqBoolean)(eq(dictEq)(x)(y))(false);
        };
    };
};
var notEq1 = function (dictEq1) {
    return function (dictEq) {
        return function (x) {
            return function (y) {
                return eq(eqBoolean)(eq1(dictEq1)(dictEq)(x)(y))(false);
            };
        };
    };
};
module.exports = {
    Eq: Eq,
    eq: eq,
    notEq: notEq,
    Eq1: Eq1,
    eq1: eq1,
    notEq1: notEq1,
    EqRecord: EqRecord,
    eqRecord: eqRecord,
    eqBoolean: eqBoolean,
    eqInt: eqInt,
    eqNumber: eqNumber,
    eqChar: eqChar,
    eqString: eqString,
    eqUnit: eqUnit,
    eqVoid: eqVoid,
    eqArray: eqArray,
    eqRec: eqRec,
    eq1Array: eq1Array,
    eqRowNil: eqRowNil,
    eqRowCons: eqRowCons
};
