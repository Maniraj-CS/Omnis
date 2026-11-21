import { Router } from "express";


const router = Router()


import {
    userRegister,
    userLogin,
    userLogout
} from "../controllers/auth.controller.js"
import { authenticate } from "../middleware/auth.middleware.js";


router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").get(authenticate , userLogout);


export default router
