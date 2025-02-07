import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import cors from "cors";
import {connected}  from './lib/db.js';
import authRoutes from "./routes/auth.route.js";
import subCategoryRoutes from "./routes/subCategory.route.js";
import categoryRoutes from "./routes/category.route.js";
import productRoutes from "./routes/product.route.js";


dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({ 
    origin:process.env.ORIGIN ,
    // Frontend URL
    credentials: true, // Allow cookies and credentials
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subCategory", subCategoryRoutes);
app.use("/api/product", productRoutes);
// app.use("/", (req,res) => {
//   res.send("API is running...");
// });


app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  next();
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  connected();
  console.log("Backend server is running!");
});