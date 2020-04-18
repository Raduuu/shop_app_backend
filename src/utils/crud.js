export const getOne = model => async (req, res) => {
    try {
        const doc = await model
            .findOne({ createdBy: req.user._id, _id: req.params.id })
            .lean()
            .exec()

        if (!doc) {
            return res.status(400).end()
        }

        res.status(200).json({ data: doc })
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const getMany = model => async (req, res) => {
    try {
        const resultsPerPage = 10
        const page = req.query.page > 1 ? req.query.page : 1
        const count = await model.count()
        const query =
            req.query.category !== 'all' && req.query.category !== undefined
                ? { category: req.query.category }
                : {}
        const docs = await model
            .find(query)
            .skip(resultsPerPage * page - resultsPerPage)
            .limit(resultsPerPage)
            .lean()
            .exec()

        res.status(200).json({ data: docs, count: count })
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const createOne = model => async (req, res) => {
    const createdBy = req.user._id
    try {
        const doc = await model.create({ ...req.body, createdBy })
        res.status(201).json({ data: doc })
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const updateOne = model => async (req, res) => {
    try {
        const updatedDoc = await model
            .findOneAndUpdate(
                {
                    _id: req.params.id
                },
                req.body,
                { new: true }
            )
            .lean()
            .exec()

        if (!updatedDoc) {
            return res.status(400).end()
        }

        res.status(200).json({ data: updatedDoc })
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const removeOne = model => async (req, res) => {
    try {
        const removed = await model.findOneAndRemove({
            _id: req.params.id
        })

        if (!removed) {
            return res.status(400).end()
        }

        return res.status(200).json({ data: removed })
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const crudControllers = model => ({
    removeOne: removeOne(model),
    updateOne: updateOne(model),
    getMany: getMany(model),
    getOne: getOne(model),
    createOne: createOne(model)
})
