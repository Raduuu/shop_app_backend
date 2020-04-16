"use strict";

var _product = _interopRequireDefault(require("../product.router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('product router', () => {
  test('has crud routes', () => {
    const routes = [{
      path: '/',
      method: 'get'
    }, {
      path: '/:id',
      method: 'get'
    }, {
      path: '/:id',
      method: 'delete'
    }, {
      path: '/:id',
      method: 'put'
    }, {
      path: '/',
      method: 'post'
    }];
    routes.forEach(route => {
      const match = _product.default.stack.find(s => s.route.path === route.path && s.route.methods[route.method]);

      expect(match).toBeTruthy();
    });
  });
});