import express from "express"
import {getUserAddresses,createAddress,updateAddress,deleteAddress} from "../controllers/AddressController.js"
import {protect} from "../middlewares/auth.js"
const router = express.Router()

router.get("/",protect,getUserAddresses)
router.post("/",protect,createAddress)
router.put("/:id",protect,updateAddress)
router.delete("/:id",protect,deleteAddress)

export default router