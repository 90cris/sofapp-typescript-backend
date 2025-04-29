import { Router } from "express";
import authUsuarios from "./auth.usuario";
import authProductos from "./auth.producto";

const router = Router();

router.use("/usuario", authUsuarios);
router.use("/producto", authProductos);

export default router;