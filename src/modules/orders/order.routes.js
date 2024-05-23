import { Router } from "express";
import * as OR from "./order.controller.js"

const router = Router();

router.post("/createOrder/:customer_id",OR.createOrder)
router.get("/orderAvgValue",OR.orderAvgValue)
router.get("/customersNoOrder",OR.customersNoOrder)
router.get("/customerMaxItems",OR.customerWithMaxItems)
router.get("/top10CustomersMoneySpent",OR.top10CustomersMoneySpent)
router.get("/customers5OrMoreOrders",OR.customers5OrMoreOrders)
router.get("/customersPercentageMoreOneOrder",OR.customersPercentageMoreOneOrder)
router.get("/customerEarliestOrder",OR.customerEarliestOrder)
router.get("/", OR.getAllOrders);
export default router;