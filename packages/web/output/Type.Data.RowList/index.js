"use strict";

// | A proxy data type whose type parameter is a type of kind `RowList`.
// |
// | Commonly used for specialising a function with a quantified type.
var RLProxy = (function () {
    function RLProxy() {

    };
    RLProxy.value = new RLProxy();
    return RLProxy;
})();
module.exports = {
    RLProxy: RLProxy
};
