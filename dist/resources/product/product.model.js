"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Product = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const productSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  quantity: {
    type: Number,
    required: true,
    trim: true,
    maxlength: 3
  },
  price: {
    type: Number,
    required: true,
    trim: true,
    maxlength: 3
  },
  createdBy: {
    type: _mongoose.default.SchemaTypes.ObjectId,
    ref: 'user',
    required: true
  },
  category: {
    type: String,
    ref: 'category',
    required: true
  }
}, {
  timestamps: true
});
productSchema.index({
  category: 1,
  name: 1
}, {
  unique: true
});

const Product = _mongoose.default.model('product', productSchema);

exports.Product = Product;