import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import { signup, signin, protect, changePassword } from './utils/auth'
import { connect } from './utils/db'
import userRouter from './resources/user/user.router'
import productRouter from './resources/product/product.router'
import categoryRouter from './resources/category/category.router'
import checkout from './utils/checkout'
import { search } from './resources/product/product.controllers'

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

app.use('/api', protect)
app.post('/api/changepassword', changePassword)
app.post('/api/checkout', checkout)
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/category', categoryRouter)
app.use('/api/search', search)

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
