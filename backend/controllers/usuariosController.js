import { db } from "../db.js";
import bcrypt from "bcryptjs";

// REGISTRO
export const registrarUsuario = async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        const [existe] = await db.execute("SELECT id FROM usuarios WHERE email = ?", [email]);

        if (existe.length > 0) {
            return res.status(400).json({ mensaje: "El correo ya existe" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await db.execute(
            "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
            [nombre, email, passwordHash]
        );

        res.json({ mensaje: "Usuario registrado" });

    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// LOGIN
export const iniciarSesion = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.execute("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });
        }

        const usuario = rows[0];

        const ok = await bcrypt.compare(password, usuario.password);

        if (!ok) {
            return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });
        }

        res.json({
            mensaje: "Inicio de sesión exitoso",
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                plan: usuario.plan
            }
        });

    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// ACTUALIZAR PLAN
export const actualizarPlan = async (req, res) => {
    const { id } = req.params;
    const { plan } = req.body;

    try {
        await db.execute("UPDATE usuarios SET plan = ? WHERE id = ?", [plan, id]);

        res.json({ mensaje: "Plan actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};
