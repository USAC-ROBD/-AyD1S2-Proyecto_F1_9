import db from "../utils/db_connection.mjs"
import { uploadFileS3, downloadFileS3 } from "../aws/s3.mjs";
import os from 'os';
import path from 'path';
import fs from 'fs/promises';

const getRootFolder = async (req, res) => {
    try {
        //sacamos los valores del json
        const { username, id_account } = req.body

        if (!username) return res.status(400).json({ status: 400, message: 'User ID is required to get root folder' })

        //retornamos la carpeta raíz
        const [rows, fields] = await db.query(` SELECT CARPETA.ID_CARPETA
                                                FROM USUARIO 
                                                    INNER JOIN CUENTA on USUARIO.ID_USUARIO = CUENTA.ID_USUARIO 
                                                    INNER JOIN CARPETA on CUENTA.ID_CUENTA = CARPETA.ID_CUENTA
                                                WHERE USUARIO.USUARIO = ? 
                                                    AND CARPETA.ID_CARPETA_PADRE IS NULL 
                                                    AND CARPETA.ID_CUENTA = ?
                                                    AND CARPETA.NOMBRE =''`, [username, id_account])
        
        if (rows.length === 0) return res.status(404).json({ status: 404, message: 'Root folder not found' })

        return res.status(200).json({ status: 200, rootFolder: rows[0].ID_CARPETA })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Internal server error' })
    }
}

const getChildItems = async (req, res) => {
    try {
        //sacamos los valores del json
        const { idFolder } = req.body

        //retornamos los archivos y carpetas hijos de la carpeta
        const [rows, fields] = await db.query(` SELECT CARPETA.ID_CARPETA, CARPETA.NOMBRE, CARPETA.CREA, CARPETA.MODIFICA, CARPETA.CREACION, CARPETA.MODIFICACION
                                                ,(  SELECT SUM(CANT)
                                                    FROM (
                                                        SELECT COUNT(*) CANT FROM CARPETA WHERE CARPETA.ID_CARPETA_PADRE = CARPETA.ID_CARPETA 
                                                        UNION 
                                                        SELECT COUNT(*) FROM ARCHIVO WHERE ARCHIVO.ID_CARPETA = CARPETA.ID_CARPETA
                                                        ) AS CHILDREN
                                                ) AS CHILDREN
                                                FROM CARPETA
                                                WHERE CARPETA.ID_CARPETA_PADRE = ?
                                                ORDER BY CARPETA.NOMBRE ASC`, [idFolder])

        const [rows2, fields2] = await db.query(`   SELECT ARCHIVO.ID_ARCHIVO, ARCHIVO.NOMBRE, ARCHIVO.TAMANO_B, ARCHIVO.KEY_S3, ARCHIVO.CREA, ARCHIVO.MODIFICA, ARCHIVO.CREACION, ARCHIVO.MODIFICACION
                                                    FROM ARCHIVO
                                                    WHERE ARCHIVO.ID_CARPETA = ?
                                                    ORDER BY ARCHIVO.NOMBRE ASC`, [idFolder])

        const folders = rows.map(folder => {
            return {
                id: folder.ID_CARPETA,
                name: folder.NOMBRE,
                type: 'folder',
                created: folder.CREA,
                modified: folder.MODIFICA,
                createdDate: folder.CREACION,
                modifiedDate: folder.MODIFICACION,
                children: folder.CHILDREN
            }
        });

        const files = rows2.map(file => {
            return {
                id: file.ID_ARCHIVO,
                name: file.NOMBRE,
                type: 'file',
                size: file.TAMANO_B,
                key: file.KEY_S3,
                created: file.CREA,
                modified: file.MODIFICA,
                createdDate: file.CREACION,
                modifiedDate: file.MODIFICACION,
            }
        });

        return res.status(200).json({ status: 200, children: [...folders, ...files] })
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
        const [rows, fields] = await db.query(`INSERT INTO ARCHIVO (ID_CARPETA, NOMBRE, TAMANO_B, KEY_S3, CREA, MODIFICA, FECHA_CREACION) 
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
        
        const [rows, fields] = await db.query(`SELECT CUENTA.ID_CUENTA FROM CUENTA where CUENTA.ID_USUARIO = ?`, [idUser])

        if (rows.length === 0) return res.status(404).json({ status: 404, message: 'Account not found' })
        
        const idCuenta = rows[0].ID_CUENTA;

        //insertamos la carpeta
        const [rows2, fields2] = await db.query(`INSERT INTO CARPETA (ID_CARPETA_PADRE, NOMBRE, ID_CUENTA, CREA, MODIFICA)
                                                VALUES (?, ?, ?, ?, ?)`, [parentFolder, name, idCuenta, username, username])

        //retornamos el id de la carpeta insertada
        return res.status(200).json({ status: 200, folder:rows2.insertId })
    }catch(error){
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Internal server error' })
    }
}

const rename = async (req, res) => {
    try {
        const { idRename, idPadre, newName, type } = req.body
        console.log({ idRename, newName, type })
        const [rows] = await db.query(`
            SELECT 1
            FROM ${type === 'file' ? 'ARCHIVO' : 'CARPETA'}
            WHERE NOMBRE = ? AND ${type === 'file' ? 'ID_CARPETA' : 'ID_CARPETA_PADRE'} = ?`, [newName, idPadre])
        if(rows.length === 0) {
            await db.query(`UPDATE ${type === 'file' ? 'ARCHIVO' : 'CARPETA'} SET NOMBRE = ? WHERE ID_${type === 'file' ? 'ARCHIVO' : 'CARPETA'} = ?;`, [newName, idRename])
            return res.status(200).json({ status: 200, icon: 'success', message: '' })
        }
        return res.status(202).json({ status: 202, icon: 'warning', message: `The ${type} named ${newName} already exists!` })
    } catch(error) {
        return res.status(500).json({ status: 500, icon: 'error', message: 'Internal server error' })
    }
}

const download = async (req, res) => {
    try {
        const { idFile, name } = req.body
        const [rows] = await db.query('SELECT KEY_S3 FROM ARCHIVO WHERE ID_ARCHIVO = ?', [idFile])
        const [file] = rows

        const res_ = await downloadFileS3(file.KEY_S3.substring(1, file.KEY_S3.length))
        const buffer = Buffer.from(res_)
        const filePath = path.join(path.join(os.homedir(), 'Downloads'), name)
        await fs.writeFile(filePath, buffer)

        return res.status(200).json({ status: 200, icon: 'success', message: 'Downloaded' })
    } catch(error) {
        console.log(error)
        return res.status(500).json({ status: 500, icon: 'error', message: 'Internal server error' })
    }
}

export const files = {
    getRootFolder,
    getChildItems,
    uploadFile,
    createFolder,
    rename,
    download,
}