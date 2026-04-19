import express from "express"
import {authorize,protect} from "../middlewares/auth.js"
import {getDashboardStats} from "../controllers/AdminController.js"
const router = express.Router()

router.get("/stats",protect,authorize("admin"),getDashboardStats)

export default router