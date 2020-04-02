import { User } from './user.model'
import { crudControllers } from '../../utils/crud'

export const user = crudControllers(User)

export const me = (req, res) => {
    res.status(200).json({ data: req.user })
}

export const getAllUsers = model => async (req, res) => {
    res.status(200).send('talent')
    try {
        const docs = await model
            .find({})
            .lean()
            .exec()

        res.status(200).json({ data: docs })
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const updateMe = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.body.user._id,
            req.body.body,
            {
                new: true
            }
        )
            .lean()
            .exec()

        res.status(200).json({ data: user })
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}
