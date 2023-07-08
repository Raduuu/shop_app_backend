import mongoose from 'mongoose'
import options from '../config'

// eslint-disable-next-line import/prefer-default-export
export const connect = (url = options.dbUrl, opts = {}) =>
    mongoose.connect(url, {
        ...opts,
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
