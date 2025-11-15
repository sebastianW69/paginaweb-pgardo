// controllers/compras.controller.js
const db = require('../db'); // tu archivo db.js

async function crearVenta(req, res) {
  // Se espera: { usuario_id, carrito: [{ producto_id, cantidad, precio_unitario }], metodo_pago, datos_pago }
  const { usuario_id, carrito, metodo_pago = 'simulado', datos_pago = {} } = req.body;
  if (!usuario_id || !Array.isArray(carrito) || carrito.length === 0) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const conn = await db.getConnection(); // si usas mysql2/promise; si no, usa pool
  try {
    await conn.beginTransaction();

    // Calcular totales y validar stock
    let total = 0;
    for (const item of carrito) {
      const [rows] = await conn.query('SELECT id, nombre, precio, stock FROM productos WHERE id = ?', [item.producto_id]);
      if (rows.length === 0) throw new Error(`Producto ${item.producto_id} no existe`);
      const producto = rows[0];
      if (producto.stock < item.cantidad) throw new Error(`Stock insuficiente para ${producto.nombre}`);
      const precioUnit = item.precio_unitario || producto.precio;
      total += parseFloat(precioUnit) * parseInt(item.cantidad);
    }

    // Insertar venta
    const [ventaRes] = await conn.query(
      'INSERT INTO ventas (usuario_id, total, estado, metodo_pago, datos_pago) VALUES (?, ?, ?, ?, ?)',
      [usuario_id, total.toFixed(2), 'pagado', metodo_pago, JSON.stringify(datos_pago)]
    );
    const ventaId = ventaRes.insertId;

    // Insertar detalle y actualizar stock
    for (const item of carrito) {
      const precioUnit = item.precio_unitario;
      const subtotal = (parseFloat(precioUnit) * parseInt(item.cantidad)).toFixed(2);
      await conn.query(
        'INSERT INTO ventas_detalle (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [ventaId, item.producto_id, item.cantidad, precioUnit, subtotal]
      );

      await conn.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.producto_id]
      );
    }

    await conn.commit();
    res.json({ ok: true, ventaId, total: total.toFixed(2) });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: err.message || 'Error procesando compra' });
  } finally {
    conn.release();
  }
}

module.exports = { crearVenta };
