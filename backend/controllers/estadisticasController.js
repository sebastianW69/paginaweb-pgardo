export const ventas_detalle = async (req, res) => {

  const userId = req.params.id;

  try {
    const [rows] = await db.query(`
      SELECT 
        DAYNAME(fecha) AS dia,
        SUM(monto) AS total
      FROM ventas
      WHERE usuario_id = ?
        AND fecha >= DATE_SUB(CURDATE(), INTERVAL (WEEKDAY(CURDATE()) + 6) DAY)
      GROUP BY dia
      ORDER BY FIELD(dia,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')
    `, [userId]);

    const diasSemana = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
    const ventas = Array(7).fill(0);

    rows.forEach(r => {
      const index = {
        Monday:0, Tuesday:1, Wednesday:2, Thursday:3, Friday:4, Saturday:5, Sunday:6
      }[r.dia];
      ventas[index] = r.total || 0;
    });

    res.json({
      dias: diasSemana,
      ventas
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo ventas semanales" });
  }
};
