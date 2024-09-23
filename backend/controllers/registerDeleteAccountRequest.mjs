import configurations from "../utils/configurations.mjs";
import db from "../utils/db_connection.mjs";

const registerDeleteAccountRequest = async (req, res) => {

    const {email} = req.body;

    try {

        const deleteRequest = await db.query(`INSERT 
            INTO SOLICITUD_ELIMINAR_CUENTA(ID_USUARIO, ID_CUENTA, ESTADO_SOLICITUD)
            SELECT C.ID_USUARIO, C.ID_CUENTA, 1
            FROM CUENTA C
            INNER JOIN USUARIO U
            ON U.ID_USUARIO = C.ID_USUARIO
            WHERE U.EMAIL = ?
            AND C.ELIMINADO != 1`,[email]);

        if (deleteRequest[0].affectedRows === 0) {
            return res.status(404).json({ "status": 404, "message": "Error al procesar la solicitud " + configurations.host + ":" + configurations.port });
        }            

        return res.status(200).json({ "status": 200, "message": "petición de eliminación de cuenta realizada! " + configurations.host + ":" + configurations.port });
        
    } catch (error) {
        console.error("Error al verificar el correo electrónico:", error);
        return res.status(500).json({ "status": 500, "message": "Error al verificar el correo electrónico " + configurations.host + ":" + configurations.port, "error": error.message });
    }

}

export const registerDeleteAccountRequestUser = {registerDeleteAccountRequest};
    
    