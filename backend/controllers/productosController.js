import { db } from "../db.js";
import fs from "fs";
import path from "path";

// helper: guarda imagen base64 y devuelve nombre de archivo
const guardarImagenBase64 = (base64, nombrePrefijo = "prod") => {
  if (!base64) return null;
  // base64: data:image/png;base64,AAA...
  const matches = base64.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
  if (!matches) return null;
  const ext = matches[1].split("/")[1];
  const data = matches[2];
  const filename = `${nombrePrefijo}-${Date.now()}.${ext}`;
  const uploadsDir = path.join(process.cwd(), "backend", "public", "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(data, "base64"));
  return `/uploads/${filename}`; // ruta pública a servir
};

// POST /api/productos
export const crearProducto = async (req, res) => {
  try {
    const { usuario_id, nombre, descripcion, precio, stock, imagenBase64 } = req.body;

    // guardar imagen (si hay)
    let imagenRuta = null;
    if (imagenBase64) imagenRuta = guardarImagenBase64(imagenBase64, "producto");

    const sql = `INSERT INTO productos (usuario_id, nombre, descripcion, precio, imagen, stock)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await db.execute(sql, [
      usuario_id,
      nombre,
      descripcion || "",
      precio || 0,
      imagenRuta,
      stock || 0
    ]);
    res.json({ mensaje: "Producto creado", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error creando producto" });
  }
};

// GET /api/productos/usuario/:usuario_id
export const listarProductosPorUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const sql = `SELECT id, usuario_id, nombre, descripcion, precio, imagen, stock, fecha_creado
                 FROM productos WHERE usuario_id = ? ORDER BY fecha_creado DESC`;
    const [rows] = await db.execute(sql, [usuario_id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error listando productos" });
  }
};

// PUT /api/productos/:id
export const editarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, imagenBase64 } = req.body;

    // si viene imagen en base64, guardarla y actualizar la ruta
    let imagenRuta = null;
    if (imagenBase64) imagenRuta = guardarImagenBase64(imagenBase64, "producto");

    // construir query dinámico
    const updates = [];
    const params = [];

    if (nombre !== undefined) { updates.push("nombre = ?"); params.push(nombre); }
    if (descripcion !== undefined) { updates.push("descripcion = ?"); params.push(descripcion); }
    if (precio !== undefined) { updates.push("precio = ?"); params.push(precio); }
    if (stock !== undefined) { updates.push("stock = ?"); params.push(stock); }
    if (imagenRuta) { updates.push("imagen = ?"); params.push(imagenRuta); }

    if (updates.length === 0) return res.status(400).json({ mensaje: "Nada para actualizar" });

    const sql = `UPDATE productos SET ${updates.join(", ")} WHERE id = ?`;
    params.push(id);
    await db.execute(sql, params);
    res.json({ mensaje: "Producto actualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error actualizando producto" });
  }
};

// DELETE /api/productos/:id
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM productos WHERE id = ?", [id]);
    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error eliminando producto" });
  }
};

export const obtenerTodos = async (req, res) =>  {
  try {
    const [rows] = await db.query("SELECT * FROM productos ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:"Error obteniendo productos" });
  }
};
