import { Router } from 'express'
import controllers from './category.controllers'

const router = Router()

// /api/category
router
    .route('/')
    .get(controllers.getMany)
    .post(controllers.createOne)

// /api/category/:id
router
    .route('/:id')
    .get(controllers.getOne)
    .put(controllers.updateOne)
    .delete(controllers.removeOne)

export default router
