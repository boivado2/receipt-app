import express from 'express'
import productsController from  "../controller/products"

const router = express.Router()

// POST: add product
router.post('/', productsController.addProduct)

// Get: all products for a vendor
/* params 
  - vendorId
*/
// router.get('/:vendorId', productsController.getVendorProducts)

// Get: all products
router.get('/', productsController.getProducts)


// Get: single product
/* params 
  - productID
*/
router.get('/:productId', productsController.getProduct)

//PUT: update product
/* params 
  - productID
*/
router.put("/:productId", productsController.updateProduct)

// DELETE: delete product
/* params 
  - vendorId
  - productID
*/
router.delete("/:vendorId/:productId", productsController.deleteProduct)


export default router