import configurations from "../utils/configurations.mjs";
import db from "../utils/db_connection.mjs";

const getRequests = async (req, res) => {
    
        try {
            const requestsChanceStorage = await db.query(`SELECT 
                    SCA.ID_CUENTA,
                    SCA.ID_SOLICITUD,
                    U.ID_USUARIO,
                    SCA.ESTADO_SOLICITUD,
                    CONCAT(U.NOMBRE, ' ', U.APELLIDO) AS NOMBRE_USUARIO, 
                    U.USUARIO,
                    U.EMAIL,
                    P.NOMBRE AS PAQUETE,
                    DATE_FORMAT(SCA.MODIFICACION , '%Y-%m-%d') AS MODIFICACION
                FROM SOLICITUD_CAMBIO_ALMACENAMIENTO SCA
                INNER JOIN CUENTA C
                ON SCA.ID_CUENTA = C.ID_CUENTA
                INNER JOIN USUARIO U
                ON C.ID_USUARIO = U.ID_USUARIO
                INNER JOIN PAQUETE P
                ON P.ID_PAQUETE = SCA.ID_PAQUETE
                WHERE ESTADO_SOLICITUD = '1'
                AND C.ELIMINADO = '0'
                ORDER BY SCA.MODIFICACION DESC`);
            
            const requestsDeleteAccount = await db.query(`SELECT 
                    SCA.ID_CUENTA,
                    SCA.ID_SOLICITUD,
                    U.ID_USUARIO,
                    SCA.ESTADO_SOLICITUD,
                    CONCAT(U.NOMBRE, ' ', U.APELLIDO) AS NOMBRE_USUARIO,
                    U.USUARIO,
                    U.EMAIL,                    
                    DATE_FORMAT(SCA.MODIFICACION , '%Y-%m-%d') AS MODIFICACION
                FROM SOLICITUD_ELIMINAR_CUENTA SCA 
                INNER JOIN CUENTA C
                ON SCA.ID_CUENTA = C.ID_CUENTA
                INNER JOIN USUARIO U
                ON C.ID_USUARIO = U.ID_USUARIO
                WHERE ESTADO_SOLICITUD = '1'
                AND C.ELIMINADO = '0'
                ORDER BY SCA.MODIFICACION DESC`);


            return res.status(200).json({ "status": 200, "solicitudes_cambio_almacenamiento": requestsChanceStorage[0], "solicitudes_eliminar_cuenta": requestsDeleteAccount[0], "message": "Requests found " + configurations.host + ":" + configurations.port });    

    
        } catch (error) {
            console.error("Error getting requests:", error);
            return res.status(500).json({ "status": 500, "message": "Error getting requests " + configurations.host + ":" + configurations.port, "error": error.message });
        }
};

export const getRequestsUser = { getRequests };