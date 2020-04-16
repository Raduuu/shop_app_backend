"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crud = require("./crud");

var _user = require("../resources/user/user.model");

var _product = require("../resources/product/product.model");

const checkout = async (req, res) => {
  try {
    let data = {};
    let totalPrice = 0;
    const user = await _user.User.findOne({
      _id: req.user._id
    }).select('email coins').exec();

    for (let i = 0; i < req.body.products.length; i++) {
      totalPrice = totalPrice + product.price;
    }

    if (totalPrice > user.coins) {
      return res.status(400).send({
        message: "you don't have enough money"
      });
    }

    for (let i = 0; i < req.body.products.length; i++) {
      const product = await _product.Product.findOne({
        _id: req.body.products[i]._id
      });

      if (product.quantity - req.body.products[i].quantity < 0) {
        return res.status(400).send({
          message: 'not enough products'
        });
      } else {
        const updatedDoc = await _product.Product.findOneAndUpdate({
          _id: req.body.products[i]._id
        }, {
          quantity: product.quantity - req.body.products[i].quantity
        }, {
          new: true
        }).lean().exec();

        if (!updatedDoc) {
          return res.status(400).end();
        }

        data[i] = updatedDoc;
      }
    }

    const updatedUser = await _user.User.findOneAndUpdate({
      email: req.user.email
    }, {
      coins: user.coins - totalPrice
    }, {
      new: true
    }).lean().exec();
    res.status(200).json({
      data: data
    });
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
};

var _default = checkout;
exports.default = _default;