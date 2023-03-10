import express from 'express'
import vendorController from '../controller/vendors'
import multer from 'multer'
import auth from '../middleware/auth'
const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/', upload.single('logo'), vendorController.addVendor)

router.put('/:id', [ auth, upload.single('logo')], vendorController.updateVendor)


router.get('/', [auth], vendorController.getVendor)



export default router


