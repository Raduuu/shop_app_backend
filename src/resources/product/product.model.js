import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
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
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
            required: true
        }
        // list: {
        //   type: mongoose.SchemaTypes.ObjectId,
        //   ref: 'list',
        //   required: true
        // }
    },
    { timestamps: true }
)

productSchema.index({ list: 1, name: 1 }, { unique: true })

export const Product = mongoose.model('product', productSchema)
