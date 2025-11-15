import { Router } from "express";
import { ventas_detalle } from "../controllers/estadisticasController.js";

const router = Router();

router.get("/ventas/:usuario_id", ventas_detalle);


export default router;
