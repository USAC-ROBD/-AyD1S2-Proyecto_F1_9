import db from "../utils/db_connection.mjs"
import { uploadFileS3 } from "../aws/s3.mjs";

const getRootFolder = async (req, res) => {
    try {
        //sacamos los valores del json
        const { username } = req.body

        if (!username) return res.status(400).json({ status: 400, message: 'User ID is required to get root folder' })

        //retorna una sola fila con la suma de los archivos en MB como used_MB
        const [rows, fields] = await db.query(`select carpeta.ID_CARPETA from usuario 
                                            INNER JOIN cuenta on usuario.ID_USUARIO = cuenta.ID_USUARIO 
                                            INNER JOIN carpeta on cuenta.ID_CUENTA = carpeta.ID_CUENTA
                                            WHERE usuario.USUARIO = ? AND carpeta.ID_CARPETA_PADRE IS NULL AND carpeta.NOMBRE =''`, [username])
        
        if (rows.length === 0) return res.status(404).json({ status: 404, message: 'Root folder not found' })

        //retornamos la carpeta raíz
        return res.status(200).json({ status: 200, rootFolder:rows[0].ID_CARPETA })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Internal server error' })
    }
}

const uploadFile = async (req, res) => {
    try{
        //sacamos los valores del json
        const { idUser, username,folder, file } = req.body

        if (!idUser || !username || !folder || !file) return res.status(400).json({ status: 400, message: 'Data uncomplete to upload the file' })

        //debemos subir el archivo a S3 y obtener la url

        const buff = Buffer.from(file.content, 'base64');
        const nombreImagen = idUser + "_" + (new Date().toLocaleDateString().replace(/\//g, "") + new Date().toLocaleTimeString().replace(/:/g, "")) + "_" + file.name ;

        const response = await uploadFileS3(buff, "Archivos/" + nombreImagen, file.type);
        
        if (response === null) {
            return res.status(500).json({ status: 500, message: "Error al subir el archivo" });
        }

        const key_s3 = `/Archivos/${nombreImagen}`;        

        //insertamos el archivo
        const [rows, fields] = await db.query(`INSERT INTO archivo (ID_CARPETA, NOMBRE, TAMANO_B, KEY_S3, CREA, MODIFICA, FECHA_CREACION) 
                                                VALUES (?, ?, ?, ?, ?, ?, current_date())`, [folder, file.name, file.size, key_s3, username,username])

        //retornamos el id del archivo insertado
        return res.status(200).json({ status: 200, file:rows.insertId })
    }catch(error){
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Internal server error' })
    }
}

const createFolder = async (req, res) => {
    try{
        //sacamos los valores del json
        const { idUser, username, parentFolder, name } = req.body

        if (!idUser || !username || !parentFolder || !name) return res.status(400).json({ status: 400, message: 'Uncomplete data to upload the file' })
        
        //obtenemos el id de la cuenta del usuario
        
        const [rows, fields] = await db.query(`SELECT cuenta.ID_CUENTA FROM cuenta where cuenta.ID_USUARIO = ?`, [idUser])

        if (rows.length === 0) return res.status(404).json({ status: 404, message: 'Account not found' })
        
        const idCuenta = rows[0].ID_CUENTA;

        //insertamos la carpeta
        const [rows2, fields2] = await db.query(`INSERT INTO carpeta (ID_CARPETA_PADRE, NOMBRE, ID_CUENTA, CREA, MODIFICA)
                                                VALUES (?, ?, ?, ?, ?)`, [parentFolder, name, idCuenta, username, username])

        //retornamos el id de la carpeta insertada
        return res.status(200).json({ status: 200, file:rows2.insertId })
    }catch(error){
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Internal server error' })
    }
}

export const files = { getRootFolder,
                       uploadFile,
                       createFolder,
 }