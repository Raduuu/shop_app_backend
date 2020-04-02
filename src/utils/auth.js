import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
    return jwt.sign({ id: user._id }, config.secrets.jwt, {
        expiresIn: config.secrets.jwtExp
    })
}

export const verifyToken = token =>
    new Promise((resolve, reject) => {
        jwt.verify(token, config.secrets.jwt, (err, payload) => {
            if (err) return reject(err)
            resolve(payload)
        })
    })

export const signup = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({ message: 'need email and password' })
    }

    try {
        const user = await User.create(req.body)
        const token = newToken(user)
        return res.status(201).send({ token })
    } catch (e) {
        return res.status(500).send({ message: 'an error has occured' })
    }
}

export const signin = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({ message: 'need email and password' })
    }

    const invalid = { message: 'Invalid email and password combination' }

    try {
        const user = await User.findOne({ email: req.body.email })
            .select('email password')
            .exec()

        if (!user) {
            return res.status(401).send(invalid)
        }

        const match = await user.checkPassword(req.body.password)

        if (!match) {
            return res.status(401).send(invalid)
        }
        const token = newToken(user)
        return res
            .status(201)
            .send({ token, admin: user.admin || false, email: user.email })
    } catch (e) {
        console.error(e)
        res.status(500).end()
    }
}

export const changePassword = async (req, res) => {
    try {
        if (!req.body.oldpassword || !req.body.newpassword) {
            return res.status(400).send('both passwords need to be in request')
        }
        const user = await User.find({
            email: req.body.email
        })
        const password = user.changePassword(
            req.body.oldpassword,
            req.body.newpassword,
            function(err) {
                console.error(err)
            }
        )
        if (!password) {
            return res.status(401).send('Invalid request')
        }
        return res.status(201).send({ password })
    } catch (e) {
        console.error(e)
        res.status(500).end()
    }
}

export const protect = async (req, res, next) => {
    const bearer = req.headers.authorization

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(401).end()
    }

    const token = bearer.split('Bearer ')[1].trim()
    let payload
    try {
        payload = await verifyToken(token)
    } catch (e) {
        return res.status(401).send('not verified')
    }

    const user = await User.findById(payload.id)
        .select('-password')
        .lean()
        .exec()

    if (!user) {
        return res.status(401).end()
    }

    req.user = user
    next()
}
