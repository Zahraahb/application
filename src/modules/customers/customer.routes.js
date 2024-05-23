import { Router } from "express";
import * as CC from "./customer.controller.js";

const router = Router();

router.post("/signup",CC.signup);
router.get("/login",CC.login)

export default router;