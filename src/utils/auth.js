import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { createTransport } from 'nodemailer'

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
            .select('email password admin coins')
            .exec()

        if (!user) {
            return res.status(401).send(invalid)
        }

        const match = await user.checkPassword(req.body.password)

        if (!match) {
            return res.status(401).send(invalid)
        }
        const token = newToken(user)
        return res.status(201).send({
            token,
            admin: user.admin || false,
            email: user.email,
            coins: user.coins
        })
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

export const changePassword = async (req, res) => {
    try {
        const id = req.body.params.id
        const user = await User.findOne({
            _id: id
        })
        if (!user) {
            res.status(401).send('user not found')
        }
        let secret = user.password + '-' + user.createdAt.getTime()
        const payload = jwt.decode(req.body.params.token, secret)
        console.log('payload', payload)

        bcrypt.hash(req.body.newpassword, 8, (err, hash) => {
            if (err) {
                return
            }
            User.findOneAndUpdate(
                { _id: req.body.params.id },
                { password: hash }
            )
                .then(() =>
                    res
                        .status(202)
                        .json({ message: 'Password change accepted' })
                )
                .catch(err => res.status(500).json(err))
        })
    } catch (e) {
        console.error(e)
        res.status(500).end()
    }
}

export const forgotPassword = async (req, res) => {
    try {
        if (req.body.email !== undefined) {
            const email = req.body.email
            const user = await User.findOne({
                email: email
            })
            if (!user) {
                res.status(401).send('user not found')
            }
            const payload = {
                id: user._id,
                email: email
            }
            let secret = user.password + '-' + user.createdAt.getTime()
            let token = jwt.sign(payload, secret, {
                expiresIn: config.secrets.jwtExp
            })

            const transporter = createTransport({
                service: 'gmail',
                auth: {
                    user: 'p.radupaul@gmail.com',
                    pass: 'dfpsvwtjrshdoimt'
                }
            })

            const mailOptions = {
                from: 'test@gmail.com', // sender address
                to: email, // list of receivers
                subject: 'Subject of your email', // Subject line
                html: `<p>Reset your password by clicking on the following link:</p><br><a href="http://localhost:3000/password/${user._id}/${token}">Link</a>` // plain text body
            }

            transporter.sendMail(mailOptions, function(err, info) {
                if (err) console.log(err)
                console.log(info)
            })
        }
        return res.status(200).send('test response')
    } catch (e) {
        res.status(400).send('error')
    }
}
