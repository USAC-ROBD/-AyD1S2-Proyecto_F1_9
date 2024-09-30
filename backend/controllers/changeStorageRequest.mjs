import configurations from "../utils/configurations.mjs";
import db from "../utils/db_connection.mjs";

const changeStorageRequest = async (req, res) => {
    const { email, id_paquete } = req.body;

    console.log({ email, id_paquete })

    try {
        const changeRequest = await db.query(`
            INSERT INTO SOLICITUD_CAMBIO_ALMACENAMIENTO (ID_USUARIO, ID_CUENTA, ID_PAQUETE, ESTADO_SOLICITUD)
            SELECT C.ID_USUARIO, C.ID_CUENTA, ?, 1
            FROM CUENTA C
            INNER JOIN USUARIO U
            ON U.ID_USUARIO = C.ID_USUARIO
            WHERE U.EMAIL = ?
            AND C.ELIMINADO = 0`, [id_paquete,email]);

        if (changeRequest[0].affectedRows === 0) {
            return res.status(404).json({ "status": 404, "message": "Error al procesar la solicitud " + configurations.host + ":" + configurations.port });
        }
        

        return res.status(200).json({ "status": 200, "message": "petición de cambio de paquete realizada! " + configurations.host + ":" + configurations.port });

    } catch (error) {
        console.error("Error al verificar el correo electrónico:", error);
        return res.status(500).json({ "status": 500, "message": "Error al verificar el correo electrónico " + configurations.host + ":" + configurations.port, "error": error.message });
    }
};

export const changeStorageRequestUser = {changeStorageRequest};
