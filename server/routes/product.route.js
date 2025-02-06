import express from 'express';
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct, } from '../controllers/product.controller.js';
import { verifyToken } from '../middlware/verifyToken.js';


const router = express.Router();

router.post('/',verifyToken,createProduct);
router.get("/",getProducts);
router.get("/:id",getProduct);
router.put("/:id",verifyToken,updateProduct);
router.delete("/:id",verifyToken,deleteProduct);



export default router;