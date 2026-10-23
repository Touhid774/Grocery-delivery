import express from "express";
import {
  createProduct,
  deleteProduct,
  getFlashDeal,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/admin.js";

const productRouter = express.Router();

productRouter.get("flash-deals", getFlashDeal);
productRouter.get("/", getProducts);
productRouter.get("/:id", getProduct);
productRouter.post("/", auth, adminAuth, createProduct);
productRouter.put("/:id", auth, adminAuth, updateProduct);
productRouter.delete("/:id", auth, adminAuth, deleteProduct);

export default productRouter;
