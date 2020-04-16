"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crud = require("../../utils/crud");

var _product = require("./product.model");

var _default = (0, _crud.crudControllers)(_product.Product);

exports.default = _default;