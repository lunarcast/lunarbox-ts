"use strict";
var $foreign = require("./foreign.js");
var Data_Symbol = require("../Data.Symbol/index.js");
var Data_Unit = require("../Data.Unit/index.js");
var Record_Unsafe = require("../Record.Unsafe/index.js");
var Type_Data_Row = require("../Type.Data.Row/index.js");
var Type_Data_RowList = require("../Type.Data.RowList/index.js");

// | A class for records where all fields have `Semiring` instances, used to
// | implement the `Semiring` instance for records.
var SemiringRecord = function (addRecord, mulRecord, oneRecord, zeroRecord) {
    this.addRecord = addRecord;
    this.mulRecord = mulRecord;
    this.oneRecord = oneRecord;
    this.zeroRecord = zeroRecord;
};

// | The `Semiring` class is for types that support an addition and
// | multiplication operation.
// |
// | Instances must satisfy the following laws:
// |
// | - Commutative monoid under addition:
// |   - Associativity: `(a + b) + c = a + (b + c)`
// |   - Identity: `zero + a = a + zero = a`
// |   - Commutative: `a + b = b + a`
// | - Monoid under multiplication:
// |   - Associativity: `(a * b) * c = a * (b * c)`
// |   - Identity: `one * a = a * one = a`
// | - Multiplication distributes over addition:
// |   - Left distributivity: `a * (b + c) = (a * b) + (a * c)`
// |   - Right distributivity: `(a + b) * c = (a * c) + (b * c)`
// | - Annihilation: `zero * a = a * zero = zero`
// |
// | **Note:** The `Number` and `Int` types are not fully law abiding
// | members of this class hierarchy due to the potential for arithmetic
// | overflows, and in the case of `Number`, the presence of `NaN` and
// | `Infinity` values. The behaviour is unspecified in these cases.
var Semiring = function (add, mul, one, zero) {
    this.add = add;
    this.mul = mul;
    this.one = one;
    this.zero = zero;
};
var zeroRecord = function (dict) {
    return dict.zeroRecord;
};
var zero = function (dict) {
    return dict.zero;
};
var semiringUnit = new Semiring(function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
}, function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
}, Data_Unit.unit, Data_Unit.unit);
var semiringRecordNil = new SemiringRecord(function (v) {
    return function (v1) {
        return function (v2) {
            return {};
        };
    };
}, function (v) {
    return function (v1) {
        return function (v2) {
            return {};
        };
    };
}, function (v) {
    return function (v1) {
        return {};
    };
}, function (v) {
    return function (v1) {
        return {};
    };
});
var semiringNumber = new Semiring($foreign.numAdd, $foreign.numMul, 1.0, 0.0);
var semiringInt = new Semiring($foreign.intAdd, $foreign.intMul, 1, 0);
var oneRecord = function (dict) {
    return dict.oneRecord;
};
var one = function (dict) {
    return dict.one;
};
var mulRecord = function (dict) {
    return dict.mulRecord;
};
var mul = function (dict) {
    return dict.mul;
};
var addRecord = function (dict) {
    return dict.addRecord;
};
var semiringRecord = function (dictRowToList) {
    return function (dictSemiringRecord) {
        return new Semiring(addRecord(dictSemiringRecord)(Type_Data_RowList.RLProxy.value), mulRecord(dictSemiringRecord)(Type_Data_RowList.RLProxy.value), oneRecord(dictSemiringRecord)(Type_Data_RowList.RLProxy.value)(Type_Data_Row.RProxy.value), zeroRecord(dictSemiringRecord)(Type_Data_RowList.RLProxy.value)(Type_Data_Row.RProxy.value));
    };
};
var add = function (dict) {
    return dict.add;
};
var semiringFn = function (dictSemiring) {
    return new Semiring(function (f) {
        return function (g) {
            return function (x) {
                return add(dictSemiring)(f(x))(g(x));
            };
        };
    }, function (f) {
        return function (g) {
            return function (x) {
                return mul(dictSemiring)(f(x))(g(x));
            };
        };
    }, function (v) {
        return one(dictSemiring);
    }, function (v) {
        return zero(dictSemiring);
    });
};
var semiringRecordCons = function (dictIsSymbol) {
    return function (dictCons) {
        return function (dictSemiringRecord) {
            return function (dictSemiring) {
                return new SemiringRecord(function (v) {
                    return function (ra) {
                        return function (rb) {
                            var tail = addRecord(dictSemiringRecord)(Type_Data_RowList.RLProxy.value)(ra)(rb);
                            var key = Data_Symbol.reflectSymbol(dictIsSymbol)(Data_Symbol.SProxy.value);
                            var insert = Record_Unsafe.unsafeSet(key);
                            var get = Record_Unsafe.unsafeGet(key);
                            return insert(add(dictSemiring)(get(ra))(get(rb)))(tail);
                        };
                    };
                }, function (v) {
                    return function (ra) {
                        return function (rb) {
                            var tail = mulRecord(dictSemiringRecord)(Type_Data_RowList.RLProxy.value)(ra)(rb);
                            var key = Data_Symbol.reflectSymbol(dictIsSymbol)(Data_Symbol.SProxy.value);
                            var insert = Record_Unsafe.unsafeSet(key);
                            var get = Record_Unsafe.unsafeGet(key);
                            return insert(mul(dictSemiring)(get(ra))(get(rb)))(tail);
                        };
                    };
                }, function (v) {
                    return function (v1) {
                        var tail = oneRecord(dictSemiringRecord)(Type_Data_RowList.RLProxy.value)(Type_Data_Row.RProxy.value);
                        var key = Data_Symbol.reflectSymbol(dictIsSymbol)(Data_Symbol.SProxy.value);
                        var insert = Record_Unsafe.unsafeSet(key);
                        return insert(one(dictSemiring))(tail);
                    };
                }, function (v) {
                    return function (v1) {
                        var tail = zeroRecord(dictSemiringRecord)(Type_Data_RowList.RLProxy.value)(Type_Data_Row.RProxy.value);
                        var key = Data_Symbol.reflectSymbol(dictIsSymbol)(Data_Symbol.SProxy.value);
                        var insert = Record_Unsafe.unsafeSet(key);
                        return insert(zero(dictSemiring))(tail);
                    };
                });
            };
        };
    };
};
module.exports = {
    Semiring: Semiring,
    add: add,
    zero: zero,
    mul: mul,
    one: one,
    SemiringRecord: SemiringRecord,
    addRecord: addRecord,
    mulRecord: mulRecord,
    oneRecord: oneRecord,
    zeroRecord: zeroRecord,
    semiringInt: semiringInt,
    semiringNumber: semiringNumber,
    semiringFn: semiringFn,
    semiringUnit: semiringUnit,
    semiringRecord: semiringRecord,
    semiringRecordNil: semiringRecordNil,
    semiringRecordCons: semiringRecordCons
};
