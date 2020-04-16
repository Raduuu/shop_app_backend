"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _user = require("./user.controllers");

const router = (0, _express.Router)(); // router.get('/', me)
// /api/user

router.route('/').get(_user.user.getMany).post(_user.user.createOne); // /api/user/:id

router.route('/:id').put(_user.user.updateOne).delete(_user.user.removeOne);
var _default = router;
exports.default = _default;