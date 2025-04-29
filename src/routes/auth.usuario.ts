import { Router } from "express";
import {
  handleLogin,
  handleRegister,
  getDatosUsuarioPorProducto,
} from "../controller/usuario.controller";

const router = Router();

router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.get("/producto/:idProducto", getDatosUsuarioPorProducto);

export default router;