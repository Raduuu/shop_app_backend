"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userSchema = new _mongoose.default.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    required: true,
    default: false
  },
  coins: {
    type: Number,
    required: true,
    default: 1000
  },
  settings: {
    theme: {
      type: String,
      required: true,
      default: 'dark'
    },
    notifications: {
      type: Boolean,
      required: true,
      default: true
    },
    compactMode: {
      type: Boolean,
      required: true,
      default: false
    }
  }
}, {
  timestamps: true
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  _bcrypt.default.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    _bcrypt.default.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};

const User = _mongoose.default.model('user', userSchema);

exports.User = User;