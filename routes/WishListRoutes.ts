import express, { Request, Response } from "express";
import { AddToWishList, getWishList, removeFromWishList } from "../controllers/WishListController.js";
import { protect } from "../middlewares/auth.js";
const router = express.Router();
router.post("/",protect, AddToWishList);
router.get("/", protect,getWishList);
router.delete("/:productId",protect, removeFromWishList);
export default router;  