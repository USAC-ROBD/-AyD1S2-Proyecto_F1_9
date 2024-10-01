import configurations from "../utils/configurations.mjs";
import db from "../utils/db_connection.mjs";

const guardarNuevaContrasena = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            "status": 400, 
            "message": "Email y contraseña son requeridos"
        });
    }

    try {

        const updateQuery = "UPDATE USUARIO SET CONTRASENA = SHA2(?, 256) WHERE EMAIL = ?";
        const updateResult = await db.query(updateQuery, [password, email]);

        if (updateResult[0].affectedRows === 0) {
            return res.status(404).json({ 
                "status": 404, 
                "message": "Usuario no encontrado"
            });
        }

        return res.status(200).json({ 
            "status": 200, 
            "message": "Contraseña actualizada exitosamente"
        });
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        return res.status(500).json({ 
            "status": 500, 
            "message": "Error interno del servidor al actualizar la contraseña"
        });
    }
};

export const setNewPassword = { guardarNuevaContrasena };