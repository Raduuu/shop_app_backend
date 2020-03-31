import { Product } from '../product.model'
import mongoose from 'mongoose'

describe('Product model', () => {
  describe('schema', () => {
    test('name', () => {
      const name = Product.schema.obj.name
      expect(name).toEqual({
        type: String,
        required: true,
        trim: true,
        maxlength: 50
      })
    })

    test('status', () => {
      const status = Product.schema.obj.status
      expect(status).toEqual({
        type: String,
        required: true,
        enum: ['active', 'complete', 'pastdue'],
        default: 'active'
      })
    })

    test('notes', () => {
      const notes = Product.schema.obj.notes
      expect(notes).toEqual(String)
    })

    test('due', () => {
      const due = Product.schema.obj.due
      expect(due).toEqual(Date)
    })

    test('createdBy', () => {
      const createdBy = Product.schema.obj.createdBy
      expect(createdBy).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
      })
    })

    test('list', () => {
      const list = Product.schema.obj.list
      expect(list).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'list',
        required: true
      })
    })
  })
})
