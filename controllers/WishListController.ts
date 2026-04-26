// controllers/wishlistController.ts
import { Request, Response } from "express";
import WishList from "../models/WishList.js";
import Product from "../models/Product.js";
import { IWishlist } from "../types/index.js";

export const AddToWishList = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const user = req.user._id;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let wishlist = await WishList.findOne({ user });
    if (!wishlist) {
      wishlist = await WishList.create({ user, products: [] });
    }

    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Product already in wishlist" 
      });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    const populatedWishlist = await WishList.findById(wishlist._id).populate("products");
    res.json({ success: true, data: populatedWishlist });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWishList = async (req: Request, res: Response) => {
  try {
    const user = req.user._id;
    let wishlist = await WishList.findOne({ user }).populate("products");
    
    if (!wishlist) {
      wishlist = await WishList.create({ user, products: [] });
    }
     
    res.json({ success: true, data: wishlist });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromWishList = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const user = req.user._id;

    const wishlist = await WishList.findOne({ user });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    if (!wishlist.products.includes(productId)) {
      return res.status(404).json({ success: false, message: "Product not in wishlist" });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId.toString()
    );
    await wishlist.save();

    const populatedWishlist = await WishList.findById(wishlist._id).populate("products");
  
    res.json({ success: true, data: populatedWishlist });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};