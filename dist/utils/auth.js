"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.protect = exports.changePassword = exports.signin = exports.signup = exports.verifyToken = exports.newToken = void 0;

var _config = _interopRequireDefault(require("../config"));

var _user = require("../resources/user/user.model");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const newToken = user => {
  return _jsonwebtoken.default.sign({
    id: user._id
  }, _config.default.secrets.jwt, {
    expiresIn: _config.default.secrets.jwtExp
  });
};

exports.newToken = newToken;

const verifyToken = token => new Promise((resolve, reject) => {
  _jsonwebtoken.default.verify(token, _config.default.secrets.jwt, (err, payload) => {
    if (err) return reject(err);
    resolve(payload);
  });
});

exports.verifyToken = verifyToken;

const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: 'need email and password'
    });
  }

  try {
    const user = await _user.User.create(req.body);
    const token = newToken(user);
    return res.status(201).send({
      token
    });
  } catch (e) {
    return res.status(500).send({
      message: 'an error has occured'
    });
  }
};

exports.signup = signup;

const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: 'need email and password'
    });
  }

  const invalid = {
    message: 'Invalid email and password combination'
  };

  try {
    const user = await _user.User.findOne({
      email: req.body.email
    }).select('email password admin coins').exec();

    if (!user) {
      return res.status(401).send(invalid);
    }

    const match = await user.checkPassword(req.body.password);

    if (!match) {
      return res.status(401).send(invalid);
    }

    const token = newToken(user);
    return res.status(201).send({
      token,
      admin: user.admin || false,
      email: user.email,
      coins: user.coins
    });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

exports.signin = signin;

const changePassword = async (req, res) => {
  try {
    if (!req.body.oldpassword || !req.body.newpassword) {
      return res.status(400).send({
        message: 'both passwords need to be in request'
      });
    }

    const user = await _user.User.findOne({
      email: req.body.email
    });
    const match = await user.checkPassword(req.body.oldpassword);

    if (!match) {
      return res.status(403).send({
        message: 'Password does not match'
      });
    }

    _bcrypt.default.hash(req.body.newpassword, 8, (err, hash) => {
      if (err) {
        return;
      }

      _user.User.findOneAndUpdate({
        email: req.body.email
      }, {
        password: hash
      }).then(() => res.status(202).json({
        message: 'Password change accepted'
      })).catch(err => res.status(500).json(err));
    });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

exports.changePassword = changePassword;

const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).end();
  }

  const token = bearer.split('Bearer ')[1].trim();
  let payload;

  try {
    payload = await verifyToken(token);
  } catch (e) {
    return res.status(401).send('not verified');
  }

  const user = await _user.User.findById(payload.id).select('-password').lean().exec();

  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
};

exports.protect = protect;