import { Product } from '../product.model'
import mongoose from 'mongoose'

describe('Product model', () => {
    describe('schema', () => {
        test('name', () => {
            const name = Product.schema.obj.name
            expect(name).toEqual({
                type: String,
                required: true,
                text: true,
                trim: true,
                maxlength: 50
            })
        })

        test('description', () => {
            const description = Product.schema.obj.description
            expect(description).toEqual({
                type: String,
                required: true,
                trim: true,
                maxlength: 100
            })
        })

        test('quantity', () => {
            const quantity = Product.schema.obj.quantity
            expect(quantity).toEqual({
                type: Number,
                required: true,
                trim: true,
                maxlength: 3
            })
        })

        test('price', () => {
            const price = Product.schema.obj.price
            expect(price).toEqual({
                type: Number,
                required: true,
                trim: true,
                maxlength: 3
            })
        })

        test('createdBy', () => {
            const createdBy = Product.schema.obj.createdBy
            expect(createdBy).toEqual({
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'user',
                required: true
            })
        })

        test('category', () => {
            const category = Product.schema.obj.category
            expect(category).toEqual({
                type: String,
                ref: 'category',
                required: true
            })
        })
    })
})
