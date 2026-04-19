import express from "express"
import {protect,authorize} from "../middlewares/auth.js"
import {getUserOrders,getOrder,createOrder,updateOrderStatus,getAllOrdes} from "../controllers/OrderController.js"
const router = express.Router()

router.get("/",protect,getUserOrders)
router.get("/:id",protect,getOrder)
router.post("/create",protect,createOrder)
router.put("/:id/status",protect,authorize("admin"),updateOrderStatus)
router.get("/admin/all",protect,authorize("admin"),getAllOrdes)
export default router
