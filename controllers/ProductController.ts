import { Request, Response } from 'express';
import Product from '../models/Product.js';
import cloudinary from '../config/cloundinary.js';
//Get all products with pagination
// GET /api/v1/products?page=1&limit=10

export const getProducts = async (req:Request, res:Response) => {
try {
    const {page = 1, limit = 10} = req.query;
    const query:any = {isActive: true};
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).skip((Number(page) - 1) * Number(limit)).limit(Number(limit));
    res.json({ "success": "true", 
       
        data:products,
        pagination:{
            total,
            page:Number(page),
            pages:Math.ceil(total/Number(limit))
        } 
    });
} catch (error) {
    res.status(500).json({ "success":"false", "message": "Error fetching products", error });
}
}
//Get Single Product
// GET  /api/v1/products/:id
export const getProductById = async (req:Request, res:Response) => {
try {    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
        return res.status(404).json({ "success": "false", 
            "message": "Product not found" });
    }  
    res.json({ "success": "true", 
         
        data:product });
} catch (error) {
    res.status(500).json({ "success":"false", "message": "Error fetching product", error });
}}

// Create Product
// POST  /api/v1/products
export const createProduct = async (req:Request, res:Response) => {
try { 
    let images = []   
    //handle file uploads 
    if(req.files && (req.files as any).length > 0) {
        const uploadPromises = (req.files as any).map((file:any) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image',folder:"ecommerce_app/products" },
                     (error:any, result:any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result!.secure_url);
                    }
                })
                uploadStream.end(file.buffer);
            });
    });
    images = await Promise.all(uploadPromises);
}
   let sizes = req.body.sizes || [];
    if(typeof sizes === "string") {
        try {
            sizes = JSON.parse(sizes);
        } catch {
            sizes = sizes.split(',').map((s:string) => s.trim()).filter((s:string) => s !="");  ;
        }   
    }
    // ensure they are arrays
    if(!Array.isArray(sizes)) sizes = [sizes];
    const productData = {...req.body, images, sizes};
    if(images.length ===  0) {
        return res.json({ "success": "false", "message": "At least one image is required" });
    }
    const product = await Product.create(productData);
    res.status(201).json({ "success": "true", 
        data:product });
} catch (error) {
    res.status(500).json({ "success":"false", "message": "Error creating product", error });
}}

//update product
// PUT  /api/v1/products/:id
export const updateProduct = async (req:Request, res:Response) => {
try { 
    let images = []   
    if(req.body.existingImages) {
        if(Array.isArray(req.body.existingImages)) {
            images = [...req.body.existingImages];
        }else {
            images = [req.body.existingImages];
    }
    //handle file uploads 
    if(req.files && (req.files as any).length > 0) {
        const uploadPromises = (req.files as any).map((file:any) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image',folder:"ecommerce_app/products" },
                     (error:any, result:any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result!.secure_url);
                    }
                })
                uploadStream.end(file.buffer);
            });
    });
     const newImages = await Promise.all(uploadPromises);
     images = [...images, ...newImages];
}}
const updates = {...req.body};
if(req.body.sizes){
    let sizes = req.body.sizes;
      if(typeof sizes === "string") {
        try {
            sizes = JSON.parse(sizes);
        } catch {
            sizes = sizes.split(',').map((s:string) => s.trim()).filter((s:string) => s !="");  ;
        }   
    }
      // ensure they are arrays
    if(!Array.isArray(sizes)) sizes = [sizes];
    updates.sizes = sizes;
}
  
if(request.body.existingImages || (req.files && (req.files as any).length > 0)) {
    updates.images = images;
}
delete updates.existingImages;
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true,runValidators:true });
  if(!product) {
    return res.status(404).json({ "success": "false", "message": "Product not found" });
  } 
  res.json({ "success": "true", 
        data:product });
   
} catch (error: any) {
    res.status(500).json({ "success":"false", "message": "Error creating product", error });
}}
// Delete Product
// DELETE  /api/v1/products/:id
export const deleteProduct = async (req:Request, res:Response) => {
try {    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) {
        return res.status(404).json({ "success": "false", "message": "Product not found" });
    }
    //Delete images from cloudinary
    if(product.images && product.images.length > 0) {
        const deletePromises = product.images.map((url:string) => {
            const publicIdMatch = url.match(/\/([^\/]+)\.[a-zA-Z]+$/);
            const publicId = publicIdMatch ? `ecommerce_app/products/${publicIdMatch[1]}` : null;
            if(publicId) {
                return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
            } 
                return Promise.resolve();
            

        });
        await Promise.all(deletePromises);
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ "success": "true", 
        message:"Product deleted successfully" });
} catch (error) {
    res.status(500).json({ "success":"false", "message": "Error deleting product", error });
}   
}
