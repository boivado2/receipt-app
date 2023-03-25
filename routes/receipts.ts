import express from 'express'
import receiptsController from  "../controller/receipts"
import auth from '../middleware/auth'
import validateObjectId from '../middleware/validateObjectId'
const router = express.Router()


// POST: add receipt
router.post('/', auth, receiptsController.addReceipt)

// Get: all receipt for a vendor
router.get('/', [auth], receiptsController.getReceipts)

// Get: all receipt
// router.get('/', receiptsController.getProducts)


// Get: single product
/* params 
  - id
*/
router.get('/:id', [auth, validateObjectId], receiptsController.getReceipt)

//PUT: update product
/* params 
  - id
*/
router.put("/:id", [auth, validateObjectId], receiptsController.updateReceipt)

// DELETE: delete product
/* params 
  - id
*/
router.delete("/:id", [auth, validateObjectId], receiptsController.deleteReceipt)


export default router