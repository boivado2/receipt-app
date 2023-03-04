import express from 'express'
import vendorController from '../controller/vendors'
import multer from 'multer'
const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/', upload.single('logoImage'), vendorController.addVendor)

router.put('/:id', upload.single('logoImage'), vendorController.updateVendor)


router.get('/', vendorController.getVendor)



export default router


