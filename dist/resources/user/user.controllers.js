"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMe = exports.getAllUsers = exports.me = exports.user = void 0;

var _user = require("./user.model");

var _crud = require("../../utils/crud");

const user = (0, _crud.crudControllers)(_user.User);
exports.user = user;

const me = (req, res) => {
  res.status(200).json({
    data: req.user
  });
};

exports.me = me;

const getAllUsers = model => async (req, res) => {
  res.status(200).send('talent');

  try {
    const docs = await model.find({}).lean().exec();
    res.status(200).json({
      data: docs
    });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

exports.getAllUsers = getAllUsers;

const updateMe = async (req, res) => {
  try {
    const user = await _user.User.findByIdAndUpdate(req.body.user._id, req.body.body, {
      new: true
    }).lean().exec();
    res.status(200).json({
      data: user
    });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

exports.updateMe = updateMe;