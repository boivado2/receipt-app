import express from 'express'
import productsController from  "../controller/products"
import multer from 'multer'
import auth from '../middleware/auth'
import validateObjectId from '../middleware/validateObjectId'
const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// POST: add product
router.post('/', [auth, upload.single('imageUrl')], productsController.addProduct)

// Get: all products for a vendor
/* params 
  - vendorId
*/
router.get('/', [auth], productsController.getVendorProducts)

// Get: all products
router.get('/', productsController.getProducts)


// Get: single product
/* params 
  - id
*/
router.get('/:id', [validateObjectId], productsController.getProduct)

//PUT: update product
/* params 
  - id
*/
router.put("/:id", [auth, validateObjectId], productsController.updateProduct)

// DELETE: delete product
/* params 
  - id
*/
router.delete("/:id", [auth, validateObjectId], productsController.deleteProduct)


export default router