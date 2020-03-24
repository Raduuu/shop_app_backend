import { Router } from 'express'
import {
  me,
  updateMe,
  getAllUsers,
  user as controllers
} from './user.controllers'

const router = Router()

// router.get('/', me)

// /api/user
router
  .route('/')
  .put(updateMe)
  .post(controllers.createOne)

// /api/user/all
// router.route('/all').get(getAllUsers)
// /api/user/:id
router
  .route('/:id')
  .put(controllers.updateOne)
  .delete(controllers.removeOne)

export default router
