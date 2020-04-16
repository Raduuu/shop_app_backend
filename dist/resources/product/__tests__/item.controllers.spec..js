"use strict";

var _product = _interopRequireDefault(require("../product.controllers"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('item controllers', () => {
  test('has crud controllers', () => {
    const crudMethods = ['getOne', 'getMany', 'createOne', 'removeOne', 'updateOne'];
    crudMethods.forEach(name => expect((0, _lodash.isFunction)(_product.default[name])).toBe(true));
  });
});