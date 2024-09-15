import db from "../utils/db_connection.mjs"

const getStorage = async (req, res) => {
    try {
        //sacamos los valores del json
        const { username } = req.body

        if (!username) return res.status(400).json({ status: 400, message: 'User ID is required to get storage used' })

        //retorna una sola fila con la suma de los archivos en MB como used_MB
        const [rows, fields] = await db.query(`select SUM(archivo.TAMANO_MB) AS used_MB from usuario 
                                            INNER JOIN cuenta on usuario.ID_USUARIO = cuenta.ID_USUARIO 
                                            INNER JOIN carpeta on cuenta.ID_CUENTA = carpeta.ID_CUENTA
                                            INNER JOIN archivo on carpeta.ID_CARPETA = archivo.ID_CARPETA
                                            WHERE usuario.USUARIO = ?  GROUP BY usuario.USUARIO`, [username])
        
        //if (rows.length === 0) return res.status(404).json({ status: 404, message: 'User not found' })
        //sacamos el espacio usado en GB
        let used_MB = 0;
        if(rows[0]) {
            used_MB = (rows[0].used_MB / 1024).toFixed(2);
        }
        //sacamos el total de almacenamiento en MB

        const [rows2, fields2] = await db.query(`select paquete.CAPACIDAD_GB AS total_GB from usuario 
                                             inner join cuenta on usuario.ID_USUARIO = cuenta.ID_USUARIO
                                            inner join paquete on cuenta.ID_PAQUETE = paquete.ID_PAQUETE
                                            where usuario.USUARIO =?`, [username])
        
        let total_GB = 0;
        if(rows2[0]) {
            total_GB = rows2[0].total_GB;
        }

        //retornamos el espacio usado y el total
        return res.status(200).json({ status: 200, used:used_MB, total:total_GB })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Internal server error' })
    }
}

export const storage = { getStorage }