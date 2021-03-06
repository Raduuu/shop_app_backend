import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
            text: true
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
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
            required: true
        },
        category: {
            type: String,
            ref: 'category',
            required: true
        }
    },
    { timestamps: true }
)

productSchema.index({ category: 1, name: 1 }, { unique: true })

export const Product = mongoose.model('product', productSchema)
