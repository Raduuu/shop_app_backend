import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema(
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

itemSchema.index({ list: 1, name: 1 }, { unique: true })

export const Item = mongoose.model('item', itemSchema)
