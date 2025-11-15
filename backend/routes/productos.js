import { Router } from "express";
import {
  crearProducto,
  listarProductosPorUsuario,
  editarProducto,
  eliminarProducto
} from "../controllers/productosController.js";
import * as productosController from "../controllers/productosController.js";


const router = Router();

router.post("/", crearProducto);
router.get("/usuario/:usuario_id", listarProductosPorUsuario);
router.get("/", productosController.obtenerTodos);
router.put("/:id", editarProducto);
router.delete("/:id", eliminarProducto);



export default router;
