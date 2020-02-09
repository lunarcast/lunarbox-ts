"use strict";
var Control_Semigroupoid = require("../Control.Semigroupoid/index.js");

// | `Category`s consist of objects and composable morphisms between them, and
// | as such are [`Semigroupoids`](#semigroupoid), but unlike `semigroupoids`
// | must have an identity element.
// |
// | Instances must satisfy the following law in addition to the
// | `Semigroupoid` law:
// |
// | - Identity: `identity <<< p = p <<< identity = p`
var Category = function (Semigroupoid0, identity) {
    this.Semigroupoid0 = Semigroupoid0;
    this.identity = identity;
};
var identity = function (dict) {
    return dict.identity;
};
var categoryFn = new Category(function () {
    return Control_Semigroupoid.semigroupoidFn;
}, function (x) {
    return x;
});
module.exports = {
    Category: Category,
    identity: identity,
    categoryFn: categoryFn
};
