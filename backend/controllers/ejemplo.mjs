// Propósito: Controlador de ejemplo para mostrar el funcionamiento de la API
import configurations from "../utils/configurations.mjs";
import db from "../utils/db_connection.mjs";

const ejemplo = (req, res) => {
    return res.status(200).json({ "status": 200, "message": "API Funcionando correctamente " + configurations.host + ":" + configurations.port });
}

const test_db = async (req, res) => {
    const [rows, fields] = await db.query(`SELECT 'DB Funcionando correctamente' as message`);
    res.status(200).json({ "status": 200, "message": "Test de la base de datos", "data": rows });
}

export const test = { ejemplo, test_db };