import express from "express"
import { addToCart, getCart, removeFromCart ,clearCart} from "../controllers/cartsController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/addToCart", auth, addToCart);

router.delete("/removeFromCart/:cartId/:courseId", removeFromCart);

router.delete("/clearCart",auth, clearCart)

router.get("/getCart", auth, getCart)

export {router as cartsRoutes};