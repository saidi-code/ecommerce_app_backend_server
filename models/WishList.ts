import mongoose, { Document, Schema } from "mongoose";
import { IWishlist } from "../types/index.js";

const wishlistSchema = new Schema<IWishlist>(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true },
);

const WishList = mongoose.model<IWishlist>("WishList", wishlistSchema);

export default WishList;