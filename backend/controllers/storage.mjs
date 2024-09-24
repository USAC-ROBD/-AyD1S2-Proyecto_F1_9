import db from "../utils/db_connection.mjs"

const getStorage = async (req, res) => {
    try {
        //sacamos los valores del json
        const { username } = req.body

        if (!username) return res.status(400).json({ status: 400, message: 'User ID is required to get storage used' })

        //retorna una sola fila con la suma de los archivos en MB como used_MB
        const [rows, fields] = await db.query(` SELECT SUM(ARCHIVO.TAMANO_B) AS used_B 
                                                FROM USUARIO 
                                                    INNER JOIN CUENTA on USUARIO.ID_USUARIO = CUENTA.ID_USUARIO 
                                                    INNER JOIN CARPETA on CUENTA.ID_CUENTA = CARPETA.ID_CUENTA
                                                    INNER JOIN ARCHIVO on CARPETA.ID_CARPETA = ARCHIVO.ID_CARPETA
                                                WHERE USUARIO.USUARIO = ?  GROUP BY USUARIO.USUARIO`, [username])
        
        //if (rows.length === 0) return res.status(404).json({ status: 404, message: 'User not found' })
        //sacamos el espacio usado en bytes y lo pasamos a GB
        let used_B = 0;
        if(rows[0]) {   //              kb    mb    gb
            used_B = (rows[0].used_B / 1024 /1024/ 1024).toFixed(3);
        }
        //sacamos el total de almacenamiento en MB

        const [rows2, fields2] = await db.query(`   SELECT PAQUETE.CAPACIDAD_GB AS total_GB 
                                                    FROM USUARIO 
                                                        INNER JOIN CUENTA on USUARIO.ID_USUARIO = CUENTA.ID_USUARIO
                                                        INNER JOIN PAQUETE on CUENTA.ID_PAQUETE = PAQUETE.ID_PAQUETE
                                                    WHERE USUARIO.USUARIO =?`, [username])
        
        let total_GB = 0;
        if(rows2[0]) {
            total_GB = rows2[0].total_GB;
        }

        //retornamos el espacio usado y el total
        return res.status(200).json({ status: 200, used:used_B, total:total_GB })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Internal server error' })
    }
}

export const storage = { getStorage }