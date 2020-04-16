"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _product = _interopRequireDefault(require("./product.controllers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)(); // /api/product

router.route('/').get(_product.default.getMany).post(_product.default.createOne); // /api/product/:id

router.route('/:id').get(_product.default.getOne).put(_product.default.updateOne).delete(_product.default.removeOne);
var _default = router;
exports.default = _default;