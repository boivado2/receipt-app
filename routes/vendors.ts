import express from 'express'
import vendorController from '../controller/vendors'

const router = express.Router()


router.get('/', vendorController.getVendor)

router.get('/products', vendorController.getVendorProducts)

router.get('./products/:id', vendorController.getVendorProduct)

router.get('./customers/', vendorController.getVendorCustomers)

router.get('./customer/:id', vendorController.getVendorCustomer)

router.get('.invoices/', vendorController.getVendorInvoices)

router.get('./invoice/:id', vendorController.getVendorInvoice)

// router.get('./settings', vendorController.)

export default router


