// controllers/wishlistController.ts
import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import WishList from "../models/WishList.js";
import Product from "../models/Product.js";
import { IWishlist } from "../types/index.js";

export const AddToWishList = async (req: Request, res: Response) => {
  try {
const { productId } = req.body;
    const userId = req.user._id;

    // if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    //   return res.status(400).json({ success: false, message: "Valid Product ID is required" });
    // }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let wishlist = await WishList.findOne({ user: userId });
    if (!wishlist) {
      wishlist =  new WishList({user:userId,products:[]});
      // wishlist = await WishList.create({ user: userId, products: [] });
    }
const existingProduct = wishlist.products.find((product)=>{
  return product._id.toString() === productId.toString()
})
if(existingProduct){
  return res.status(400).json({ 
        success: true, 
        message: "Product already in wishlist" 
      });
}else{
   wishlist.products.push(productId);
}
   
    await wishlist.save();

    const populatedWishlist = await WishList.findById(wishlist._id).populate("products");
    res.json({ success: true, data: populatedWishlist });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
    console.error(error)
  }
};

export const getWishList = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    let wishlist = await WishList.findOne({ user: userId }).populate("products");
    
    if (!wishlist) {
      wishlist = await WishList.create({ user: userId, products: [] });
    }
     
    res.json({ success: true, data: wishlist });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
    console.error(error)
  }
};

export const removeFromWishList = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    //   return res.status(400).json({ success: false, message: "Valid Product ID is required" });
    // }

    const wishlist = await WishList.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    if (!wishlist.products.some(id => id.toString() === productId)) {
      return res.status(404).json({ success: false, message: "Product not in wishlist" });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );
    await wishlist.save();

    const populatedWishlist = await WishList.findById(wishlist._id).populate("products");
  
    res.json({ success: true, data: populatedWishlist });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
    console.error(error)
  }
};
