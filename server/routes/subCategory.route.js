import express from 'express';
import { createSubCategory, deleteSubCategory, getSingleSubCategory, getSubCategories, getSubCategory } from '../controllers/subCategory.controller.js';
import { verifyToken } from '../middlware/verifyToken.js'; 



const router = express.Router();

router.post('/',verifyToken,createSubCategory);
router.get("/",getSubCategories);
router.get("/:id",getSubCategory);
router.put("/single/:id",getSingleSubCategory);
router.delete("/:id",verifyToken,deleteSubCategory);



export default router;