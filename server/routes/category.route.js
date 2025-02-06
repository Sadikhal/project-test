import express from 'express';
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/category.controller.js';
import { verifyToken } from '../middlware/verifyToken.js'; 



const router = express.Router();

router.post('/',verifyToken,createCategory);

router.get("/",getCategories);
router.get("/:id",getCategory);
router.put("/:id",verifyToken,updateCategory);
router.delete("/:id",verifyToken,deleteCategory);



export default router;