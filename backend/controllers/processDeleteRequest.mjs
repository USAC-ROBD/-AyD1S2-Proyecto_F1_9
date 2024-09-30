import configurations from "../utils/configurations.mjs";
import db from "../utils/db_connection.mjs";

const processDeleteRequest = async (req, res) => {
    const { id, state } = req.body;

    try {
        await db.query("UPDATE SOLICITUD_CAMBIO_ALMACENAMIENTO SET ESTADO_SOLICITUD = ? WHERE ID_SOLICITUD = ?", [state, id]);
        return res.status(200).json({ "status": 200, "message": "Solicitud de cambio de almacenamiento actualizada " + configurations.host + ":" + configurations.port });
    } catch (error) {
        console.error("Error updating storage change request:", error);
        return res.status(500).json({ "status": 500, "message": "Error updating storage change request " + configurations.host + ":" + configurations.port, "error": error.message });
    }
};

export const processDeleteRequestUser = { processDeleteRequest };