import express from "express";
import cors from "cors";
import usuariosRoutes from "./routes/usuarios.js";
import productosRoutes from "./routes/productos.js";
import estadisticasRoutes from "./routes/estadisticas.js";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

// servir archivos subidos
app.use("/uploads", express.static(path.join(process.cwd(), "backend", "public", "uploads")));

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/estadisticas", estadisticasRoutes);

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
