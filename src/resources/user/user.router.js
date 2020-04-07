import { Router } from 'express'
import { user as controllers } from './user.controllers'

const router = Router()

// router.get('/', me)

// /api/user
router
    .route('/')
    .get(controllers.getMany)
    .post(controllers.createOne)

// /api/user/:id
router
    .route('/:id')
    .put(controllers.updateOne)
    .delete(controllers.removeOne)

export default router
