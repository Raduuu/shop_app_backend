import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import {
    signup,
    signin,
    protect,
    changePassword,
    forgotPassword
} from './utils/auth'
import { connect } from './utils/db'
import userRouter from './resources/user/user.router'
import productRouter from './resources/product/product.router'
import categoryRouter from './resources/category/category.router'
import checkout from './utils/checkout'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.post('/signup', signup)
app.post('/signin', signin)

app.get('/', function(req, res) {
    res.send('hello world')
})

app.post('/forgotpassword', forgotPassword)
app.post('/changepassword', changePassword)
app.use('/api', protect)
app.post('/api/checkout', checkout)
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/category', categoryRouter)

export const start = async () => {
    try {
        await connect()
        app.listen(config.port, () => {
            console.log(`REST API on http://localhost:${config.port}/api`)
        })
    } catch (e) {
        console.error(e)
    }
}
