"use strict";
var $foreign = require("./foreign.js");
var Data_Eq = require("../Data.Eq/index.js");
var Data_Ordering = require("../Data.Ordering/index.js");
var Data_Ring = require("../Data.Ring/index.js");
var Data_Semiring = require("../Data.Semiring/index.js");
var Data_Symbol = require("../Data.Symbol/index.js");
var Record_Unsafe = require("../Record.Unsafe/index.js");
var Type_Data_RowList = require("../Type.Data.RowList/index.js");
var OrdRecord = function (EqRecord0, compareRecord) {
    this.EqRecord0 = EqRecord0;
    this.compareRecord = compareRecord;
};

// | The `Ord1` type class represents totally ordered type constructors.
var Ord1 = function (Eq10, compare1) {
    this.Eq10 = Eq10;
    this.compare1 = compare1;
};

// | The `Ord` type class represents types which support comparisons with a
// | _total order_.
// |
// | `Ord` instances should satisfy the laws of total orderings:
// |
// | - Reflexivity: `a <= a`
// | - Antisymmetry: if `a <= b` and `b <= a` then `a = b`
// | - Transitivity: if `a <= b` and `b <= c` then `a <= c`
var Ord = function (Eq0, compare) {
    this.Eq0 = Eq0;
    this.compare = compare;
};
var ordVoid = new Ord(function () {
    return Data_Eq.eqVoid;
}, function (v) {
    return function (v1) {
        return Data_Ordering.EQ.value;
    };
});
var ordUnit = new Ord(function () {
    return Data_Eq.eqUnit;
}, function (v) {
    return function (v1) {
        return Data_Ordering.EQ.value;
    };
});
var ordString = new Ord(function () {
    return Data_Eq.eqString;
}, $foreign.ordStringImpl(Data_Ordering.LT.value)(Data_Ordering.EQ.value)(Data_Ordering.GT.value));
var ordRecordNil = new OrdRecord(function () {
    return Data_Eq.eqRowNil;
}, function (v) {
    return function (v1) {
        return function (v2) {
            return Data_Ordering.EQ.value;
        };
    };
});
var ordOrdering = new Ord(function () {
    return Data_Ordering.eqOrdering;
}, function (v) {
    return function (v1) {
        if (v instanceof Data_Ordering.LT && v1 instanceof Data_Ordering.LT) {
            return Data_Ordering.EQ.value;
        };
        if (v instanceof Data_Ordering.EQ && v1 instanceof Data_Ordering.EQ) {
            return Data_Ordering.EQ.value;
        };
        if (v instanceof Data_Ordering.GT && v1 instanceof Data_Ordering.GT) {
            return Data_Ordering.EQ.value;
        };
        if (v instanceof Data_Ordering.LT) {
            return Data_Ordering.LT.value;
        };
        if (v instanceof Data_Ordering.EQ && v1 instanceof Data_Ordering.LT) {
            return Data_Ordering.GT.value;
        };
        if (v instanceof Data_Ordering.EQ && v1 instanceof Data_Ordering.GT) {
            return Data_Ordering.LT.value;
        };
        if (v instanceof Data_Ordering.GT) {
            return Data_Ordering.GT.value;
        };
        throw new Error("Failed pattern match at Data.Ord (line 112, column 1 - line 119, column 21): " + [ v.constructor.name, v1.constructor.name ]);
    };
});
var ordNumber = new Ord(function () {
    return Data_Eq.eqNumber;
}, $foreign.ordNumberImpl(Data_Ordering.LT.value)(Data_Ordering.EQ.value)(Data_Ordering.GT.value));
var ordInt = new Ord(function () {
    return Data_Eq.eqInt;
}, $foreign.ordIntImpl(Data_Ordering.LT.value)(Data_Ordering.EQ.value)(Data_Ordering.GT.value));
var ordChar = new Ord(function () {
    return Data_Eq.eqChar;
}, $foreign.ordCharImpl(Data_Ordering.LT.value)(Data_Ordering.EQ.value)(Data_Ordering.GT.value));
var ordBoolean = new Ord(function () {
    return Data_Eq.eqBoolean;
}, $foreign.ordBooleanImpl(Data_Ordering.LT.value)(Data_Ordering.EQ.value)(Data_Ordering.GT.value));
var compareRecord = function (dict) {
    return dict.compareRecord;
};
var ordRecord = function (dictRowToList) {
    return function (dictOrdRecord) {
        return new Ord(function () {
            return Data_Eq.eqRec()(dictOrdRecord.EqRecord0());
        }, compareRecord(dictOrdRecord)(Type_Data_RowList.RLProxy.value));
    };
};
var compare1 = function (dict) {
    return dict.compare1;
};
var compare = function (dict) {
    return dict.compare;
};

// | Compares two values by mapping them to a type with an `Ord` instance.
var comparing = function (dictOrd) {
    return function (f) {
        return function (x) {
            return function (y) {
                return compare(dictOrd)(f(x))(f(y));
            };
        };
    };
};

// | Test whether one value is _strictly greater than_ another.
var greaterThan = function (dictOrd) {
    return function (a1) {
        return function (a2) {
            var v = compare(dictOrd)(a1)(a2);
            if (v instanceof Data_Ordering.GT) {
                return true;
            };
            return false;
        };
    };
};

// | Test whether one value is _non-strictly greater than_ another.
var greaterThanOrEq = function (dictOrd) {
    return function (a1) {
        return function (a2) {
            var v = compare(dictOrd)(a1)(a2);
            if (v instanceof Data_Ordering.LT) {
                return false;
            };
            return true;
        };
    };
};

// | The sign function; always evaluates to either `one` or `negate one`. For
// | any `x`, we should have `signum x * abs x == x`.
var signum = function (dictOrd) {
    return function (dictRing) {
        return function (x) {
            var $43 = greaterThanOrEq(dictOrd)(x)(Data_Semiring.zero(dictRing.Semiring0()));
            if ($43) {
                return Data_Semiring.one(dictRing.Semiring0());
            };
            return Data_Ring.negate(dictRing)(Data_Semiring.one(dictRing.Semiring0()));
        };
    };
};

// | Test whether one value is _strictly less than_ another.
var lessThan = function (dictOrd) {
    return function (a1) {
        return function (a2) {
            var v = compare(dictOrd)(a1)(a2);
            if (v instanceof Data_Ordering.LT) {
                return true;
            };
            return false;
        };
    };
};

// | Test whether one value is _non-strictly less than_ another.
var lessThanOrEq = function (dictOrd) {
    return function (a1) {
        return function (a2) {
            var v = compare(dictOrd)(a1)(a2);
            if (v instanceof Data_Ordering.GT) {
                return false;
            };
            return true;
        };
    };
};

// | Take the maximum of two values. If they are considered equal, the first
// | argument is chosen.
var max = function (dictOrd) {
    return function (x) {
        return function (y) {
            var v = compare(dictOrd)(x)(y);
            if (v instanceof Data_Ordering.LT) {
                return y;
            };
            if (v instanceof Data_Ordering.EQ) {
                return x;
            };
            if (v instanceof Data_Ordering.GT) {
                return x;
            };
            throw new Error("Failed pattern match at Data.Ord (line 167, column 3 - line 170, column 12): " + [ v.constructor.name ]);
        };
    };
};

// | Take the minimum of two values. If they are considered equal, the first
// | argument is chosen.
var min = function (dictOrd) {
    return function (x) {
        return function (y) {
            var v = compare(dictOrd)(x)(y);
            if (v instanceof Data_Ordering.LT) {
                return x;
            };
            if (v instanceof Data_Ordering.EQ) {
                return x;
            };
            if (v instanceof Data_Ordering.GT) {
                return y;
            };
            throw new Error("Failed pattern match at Data.Ord (line 158, column 3 - line 161, column 12): " + [ v.constructor.name ]);
        };
    };
};
var ordArray = function (dictOrd) {
    return new Ord(function () {
        return Data_Eq.eqArray(dictOrd.Eq0());
    }, (function () {
        var toDelta = function (x) {
            return function (y) {
                var v = compare(dictOrd)(x)(y);
                if (v instanceof Data_Ordering.EQ) {
                    return 0;
                };
                if (v instanceof Data_Ordering.LT) {
                    return 1;
                };
                if (v instanceof Data_Ordering.GT) {
                    return -1 | 0;
                };
                throw new Error("Failed pattern match at Data.Ord (line 65, column 7 - line 68, column 17): " + [ v.constructor.name ]);
            };
        };
        return function (xs) {
            return function (ys) {
                return compare(ordInt)(0)($foreign.ordArrayImpl(toDelta)(xs)(ys));
            };
        };
    })());
};
var ord1Array = new Ord1(function () {
    return Data_Eq.eq1Array;
}, function (dictOrd) {
    return compare(ordArray(dictOrd));
});
var ordRecordCons = function (dictOrdRecord) {
    return function (dictCons) {
        return function (dictIsSymbol) {
            return function (dictOrd) {
                return new OrdRecord(function () {
                    return Data_Eq.eqRowCons(dictOrdRecord.EqRecord0())()(dictIsSymbol)(dictOrd.Eq0());
                }, function (v) {
                    return function (ra) {
                        return function (rb) {
                            var key = Data_Symbol.reflectSymbol(dictIsSymbol)(Data_Symbol.SProxy.value);
                            var left = compare(dictOrd)(Record_Unsafe.unsafeGet(key)(ra))(Record_Unsafe.unsafeGet(key)(rb));
                            var $49 = Data_Eq.notEq(Data_Ordering.eqOrdering)(left)(Data_Ordering.EQ.value);
                            if ($49) {
                                return left;
                            };
                            return compareRecord(dictOrdRecord)(Type_Data_RowList.RLProxy.value)(ra)(rb);
                        };
                    };
                });
            };
        };
    };
};

// | Clamp a value between a minimum and a maximum. For example:
// |
// | ``` purescript
// | let f = clamp 0 10
// | f (-5) == 0
// | f 5    == 5
// | f 15   == 10
// | ```
var clamp = function (dictOrd) {
    return function (low) {
        return function (hi) {
            return function (x) {
                return min(dictOrd)(hi)(max(dictOrd)(low)(x));
            };
        };
    };
};

// | Test whether a value is between a minimum and a maximum (inclusive).
// | For example:
// |
// | ``` purescript
// | let f = between 0 10
// | f 0    == true
// | f (-5) == false
// | f 5    == true
// | f 10   == true
// | f 15   == false
// | ```
var between = function (dictOrd) {
    return function (low) {
        return function (hi) {
            return function (x) {
                if (lessThan(dictOrd)(x)(low)) {
                    return false;
                };
                if (greaterThan(dictOrd)(x)(hi)) {
                    return false;
                };
                return true;
            };
        };
    };
};

// | The absolute value function. `abs x` is defined as `if x >= zero then x
// | else negate x`.
var abs = function (dictOrd) {
    return function (dictRing) {
        return function (x) {
            var $53 = greaterThanOrEq(dictOrd)(x)(Data_Semiring.zero(dictRing.Semiring0()));
            if ($53) {
                return x;
            };
            return Data_Ring.negate(dictRing)(x);
        };
    };
};
module.exports = {
    Ord: Ord,
    compare: compare,
    Ord1: Ord1,
    compare1: compare1,
    lessThan: lessThan,
    lessThanOrEq: lessThanOrEq,
    greaterThan: greaterThan,
    greaterThanOrEq: greaterThanOrEq,
    comparing: comparing,
    min: min,
    max: max,
    clamp: clamp,
    between: between,
    abs: abs,
    signum: signum,
    OrdRecord: OrdRecord,
    compareRecord: compareRecord,
    ordBoolean: ordBoolean,
    ordInt: ordInt,
    ordNumber: ordNumber,
    ordString: ordString,
    ordChar: ordChar,
    ordUnit: ordUnit,
    ordVoid: ordVoid,
    ordArray: ordArray,
    ordOrdering: ordOrdering,
    ord1Array: ord1Array,
    ordRecordNil: ordRecordNil,
    ordRecordCons: ordRecordCons,
    ordRecord: ordRecord
};
