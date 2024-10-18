import configurations from "../utils/configurations.mjs";
import db from "../utils/db_connection.mjs";

const getCurrentStorage = async (req, res) => {
    const { email } = req.body;

    try {
        const packages = await db.query(`
            SELECT p.* 
            FROM PAQUETE p 
            INNER JOIN CUENTA c ON c.ID_PAQUETE != p.ID_PAQUETE 
            INNER JOIN USUARIO u ON u.ID_USUARIO = c.ID_USUARIO 
            WHERE u.EMAIL = ?`, [email]);

        if (packages[0].length === 0) {
            return res.status(404).json({ "status": 404, "message": "No hay paquetes encontrados " + configurations.host + ":" + configurations.port });
        }

        return res.status(200).json({ "status": 200, "data": packages[0], "message": "paquetes " + configurations.host + ":" + configurations.port });

    } catch (error) {
        console.error("Error al verificar el correo electrónico:", error);
        return res.status(500).json({ "status": 500, "message": "Error al verificar el correo electrónico " + configurations.host + ":" + configurations.port, "error": error.message });
    }
};

export const getCurrentStorageUser = {getCurrentStorage};
