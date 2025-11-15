import { Router } from "express";
import { registrarUsuario, iniciarSesion, actualizarPlan } from "../controllers/usuariosController.js";

const router = Router();

// RUTAS
router.post("/registro", registrarUsuario);
router.post("/login", iniciarSesion);
router.put("/:id/plan", actualizarPlan);

// ➤ Actualizar plan del usuario
router.put("/plan", (req, res) => {
  const { id, plan } = req.body;

  const sql = "UPDATE usuarios SET plan = ? WHERE id = ?";
  db.query(sql, [plan, id], (err) => {
    if (err) return res.status(500).json({ error: "Error al actualizar plan" });

    res.json({ mensaje: "Plan actualizado correctamente" });
  });
});


export default router;
