import express from "express";
import {
    createOrder,
    getAllOrdes,
    getOrder,
    getUserOrders,
    updateOrderStatus,
} from "../controllers/OrderController.js";
import { authorize, protect } from "../middlewares/auth.js";
const router = express.Router();

router.get("/", protect, getUserOrders);
router.get("/:id", protect, getOrder);
router.post("/", protect, createOrder);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);
router.get("/admin/all", protect, authorize("admin"), getAllOrdes);
export default router;
