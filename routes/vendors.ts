import express from 'express'
import vendorController from '../controller/vendors'

const router = express.Router()

router.post('/', vendorController.addVendor)

router.put('/:vendorId', vendorController.updateVendor)


router.get('/', vendorController.getVendor)



export default router


