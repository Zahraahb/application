import { Router } from "express";
import * as PC from "./product.controller.js"

const router = Router();
router.post("/addProduct",PC.addProduct)
router.get("/categoriesRevenue",PC.categoryTotalRevenue)
router.get("/numberSoldItems",PC.numberOfSoldItems)
router.get("/",PC.getAllProducts)

export default router;

