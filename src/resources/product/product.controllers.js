import { crudControllers } from '../../utils/crud'
import { Product } from './product.model'

export default crudControllers(Product)

export const search = async (req, res) => {
    try {
        const products = await Product.find({
            name: { $regex: `.*${req.query.query}.*` }
        })
        if (products.length > 0) {
            return res.status(200).send({ products })
        } else {
            return res.status(400).send({ message: 'Not found' })
        }
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}
