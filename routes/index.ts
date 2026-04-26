import express from 'express';
import productsRouter from './productsRoutes.js';
import cartRoutes from "./CartRoutes.js"
import orderRoutes from "./OrderRoutes.js"
import addressRoutes from "./AddressRoutes.js"
import adminRoutes from "./AdminRoutes.js"
import wishListRoutes from "./WishListRoutes.js"
const router = express.Router();
router.use('/products', productsRouter); 
router.use("/cart",cartRoutes)   
router.use("/orders",orderRoutes)
router.use("/addresses",addressRoutes)
router.use("/wishlist",wishListRoutes)
router.use("/admin",adminRoutes)
export default router;