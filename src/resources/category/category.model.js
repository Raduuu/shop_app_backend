import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        description: String,
        createdBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
            required: true
        }
    },
    { timestamps: true }
)

categorySchema.index({ user: 1, name: 1 }, { unique: true })

export const Category = mongoose.model('category', categorySchema)
