import db from "../utils/db_connection.mjs"
import { uploadFileS3, deleteObjectS3 } from "../aws/s3.mjs";

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
        const [rows, fields] = await db.query(` 
            SELECT CARPETA.ID_CARPETA, CARPETA.NOMBRE, CARPETA.FAVORITO, CARPETA.CREA, CARPETA.MODIFICA, CARPETA.CREACION, CARPETA.MODIFICACION,
                   (SELECT SUM(CANT)
                    FROM (
                        SELECT COUNT(*) CANT FROM CARPETA WHERE CARPETA.ID_CARPETA_PADRE = CARPETA.ID_CARPETA 
                        UNION 
                        SELECT COUNT(*) FROM ARCHIVO WHERE ARCHIVO.ID_CARPETA = CARPETA.ID_CARPETA
                    ) AS CHILDREN
                   ) AS CHILDREN,
                   (SELECT COUNT(*) FROM COMPARTIR WHERE COMPARTIR.ID_CARPETA = CARPETA.ID_CARPETA AND TIPO_COMPARTIR = 2) AS TOTAL_COMPARTIDO
            FROM CARPETA
            WHERE ELIMINADO = 0 AND CARPETA.ID_CARPETA_PADRE = ?
            ORDER BY CARPETA.NOMBRE ASC`, [idFolder]);


        const [rows2, fields2] = await db.query(`
                SELECT ARCHIVO.ID_ARCHIVO, ARCHIVO.NOMBRE, ARCHIVO.FAVORITO, ARCHIVO.TAMANO_B, ARCHIVO.KEY_S3, ARCHIVO.CREA, ARCHIVO.MODIFICA, ARCHIVO.CREACION, ARCHIVO.MODIFICACION,
                       (SELECT COUNT(*) FROM COMPARTIR WHERE COMPARTIR.ID_ARCHIVO = ARCHIVO.ID_ARCHIVO AND TIPO_COMPARTIR = 1) AS TOTAL_COMPARTIDO
                FROM ARCHIVO
                WHERE ELIMINADO = 0 AND ARCHIVO.ID_CARPETA = ?
                ORDER BY ARCHIVO.NOMBRE ASC
            `, [idFolder]);


        const folders = rows.map(folder => {
            return {
                id: folder.ID_CARPETA,
                name: folder.NOMBRE,
                favorite: folder.FAVORITO,
                type: 'folder',
                created: folder.CREA,
                modified: folder.MODIFICA,
                createdDate: folder.CREACION,
                modifiedDate: folder.MODIFICACION,
                children: folder.CHILDREN,
                shared: folder.TOTAL_COMPARTIDO
            }
        });

        const files = rows2.map(file => {
            return {
                id: file.ID_ARCHIVO,
                name: file.NOMBRE,
                favorite: file.FAVORITO,
                type: 'file',
                size: file.TAMANO_B,
                key: file.KEY_S3,
                created: file.CREA,
                modified: file.MODIFICA,
                createdDate: file.CREACION,
                modifiedDate: file.MODIFICACION,
                shared: file.TOTAL_COMPARTIDO
            }
        });

        return res.status(200).json({ status: 200, children: [...folders, ...files] })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Internal server error' })
    }
}

const getDeletedItems = async (req, res) => {
    try {
        //sacamos los valores del json
        const { idUsuario } = req.body

        if (!idUsuario) return res.status(400).json({ status: 400, message: 'User ID is required to get deleted items' })

        //obtenemos el id de la cuenta del usuario

        const [rows, fields] = await db.query(`SELECT CUENTA.ID_CUENTA FROM CUENTA where CUENTA.ID_USUARIO = ?`, [idUsuario])

        if (rows.length === 0) return res.status(404).json({ status: 404, message: 'Account not found' })

        const idCuenta = rows[0].ID_CUENTA;

        //retornamos los archivos y carpetas hijos de la carpeta
        const [rows2, fields2] = await db.query(` SELECT CARPETA.ID_CARPETA, CARPETA.NOMBRE, CARPETA.CREA, CARPETA.MODIFICA, CARPETA.CREACION, CARPETA.MODIFICACION
                                                ,(  SELECT SUM(CANT)
                                                    FROM (
                                                        SELECT COUNT(*) CANT FROM CARPETA WHERE CARPETA.ID_CARPETA_PADRE = CARPETA.ID_CARPETA 
                                                        UNION 
                                                        SELECT COUNT(*) FROM ARCHIVO WHERE ARCHIVO.ID_CARPETA = CARPETA.ID_CARPETA
                                                        ) AS CHILDREN
                                                ) AS CHILDREN
                                                FROM CARPETA WHERE ELIMINADO = 1 and CARPETA.ID_CUENTA = ?`, [idCuenta])

        const [rows3, fields3] = await db.query(`   SELECT ARCHIVO.ID_ARCHIVO, ARCHIVO.NOMBRE, ARCHIVO.TAMANO_B, ARCHIVO.KEY_S3, ARCHIVO.CREA, ARCHIVO.MODIFICA, ARCHIVO.CREACION, ARCHIVO.MODIFICACION
                                                    FROM ARCHIVO INNER JOIN CARPETA on ARCHIVO.ID_CARPETA = CARPETA.ID_CARPETA
                                                    WHERE CARPETA.ID_CUENTA = ? and ARCHIVO.ELIMINADO = 1`, [idCuenta])

        const folders = rows2.map(folder => {
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

        const files = rows3.map(file => {
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
    try {
        //sacamos los valores del json
        const { idUser, username, folder, file } = req.body

        if (!idUser || !username || !folder || !file) return res.status(400).json({ status: 400, message: 'Data uncomplete to upload the file' })

        //debemos subir el archivo a S3 y obtener la url

        const buff = Buffer.from(file.content, 'base64');
        const nombreImagen = idUser + "_" + (new Date().toLocaleDateString().replace(/\//g, "") + new Date().toLocaleTimeString().replace(/:/g, "")) + "_" + file.name;

        const response = await uploadFileS3(buff, "Archivos/" + nombreImagen, file.type);

        if (response === null) {
            return res.status(500).json({ status: 500, message: "Error al subir el archivo" });
        }

        const key_s3 = `Archivos/${nombreImagen}`;

        //insertamos el archivo
        const [rows, fields] = await db.query(`INSERT INTO ARCHIVO (ID_CARPETA, NOMBRE, TAMANO_B, KEY_S3, CREA, MODIFICA, FECHA_CREACION) 
                                                VALUES (?, ?, ?, ?, ?, ?, current_date())`, [folder, file.name, file.size, key_s3, username, username])

        //retornamos el id del archivo insertado
        return res.status(200).json({ status: 200, file: rows.insertId })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Internal server error' })
    }
}

const createFolder = async (req, res) => {
    try {
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
        return res.status(200).json({ status: 200, folder: rows2.insertId })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Internal server error' })
    }
}

const addFolderTags = async (req, res) => {
    try {
        const { folderID, tags, deleteds } = req.body

        let query = ''

        for(const tag of tags) {
            query += (query !== '' ? '\n\tUNION' : '') + `\n\tSELECT '${tag}' WHERE NOT EXISTS (SELECT 1 FROM ETIQUETA WHERE NOMBRE = '${tag}')`
        }

        await db.query(`INSERT INTO ETIQUETA (NOMBRE) ${query}`)

        query = ''
        for(const tag of tags) {
            query += (query !== '' ? ' OR ' : '') + `NOMBRE = '${tag}'`
        }

        const [tagIDs] = await db.query(`SELECT ID_ETIQUETA FROM ETIQUETA WHERE ${query}`)

        query = ''
        for(const tagID of tagIDs) {
            query += (query !== '' ? '\n\tUNION' : '') + `\n\tSELECT ${folderID}, ${tagID.ID_ETIQUETA} WHERE NOT EXISTS (SELECT 1 FROM CARPETA_ETIQUETA WHERE ID_CARPETA = '${folderID}' AND ID_ETIQUETA = '${tagID.ID_ETIQUETA}')`
        }

        await db.query(`INSERT INTO CARPETA_ETIQUETA (ID_CARPETA, ID_ETIQUETA) ${query}`)

        if(deleteds.length > 0) {
            query = ''
            for(const tag of deleteds) {
                query += (query !== '' ? ' OR ' : '') + `NOMBRE = '${tag}'`
            }

            const [tagIDs] = await db.query(`SELECT ID_ETIQUETA FROM ETIQUETA WHERE ${query}`)

            query = ''
            for(const id of tagIDs) {
                query += (query !== '' ? ' OR ' : '') + `(ID_CARPETA = ${folderID} AND ID_ETIQUETA = ${id.ID_ETIQUETA})`
            }

            await db.query(`DELETE FROM CARPETA_ETIQUETA WHERE ${query}`)
        }

        return res.status(200).json({ status: 200, icon: 'success'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, icon: 'error', message: 'Internal server error'})
    }
}

const getFolderTags = async (req, res) => {
    try {

        const { folderID } = req.query

        let [ tags ] = await db.query(`
        SELECT NOMBRE FROM ETIQUETA e1 WHERE e1.ID_ETIQUETA IN (
            SELECT e2.ID_ETIQUETA FROM CARPETA_ETIQUETA e2 WHERE
            e2.ID_CARPETA = ${folderID}
        )`)

        for(let i = 0; i < tags.length; i ++) {
            tags[i] = tags[i].NOMBRE
        }

        return res.status(200).json({ status: 200, icon: 'success', tags })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, icon: 'error', message: 'Internal server error' })
    }
}

const deleteFile = async (req, res) => {
    try {
        //sacamos los valores del json
        const { idFile, type } = req.body

        if (!idFile || !type) return res.status(400).json({ status: 400, message: 'Data uncomplete to delete the file' })

        //cambiamos el estado del archivo/ carpeta eliminado

        if (type === 'file') {
            const [rows, fields] = await db.query(`UPDATE ARCHIVO SET ELIMINADO = 1 WHERE ID_ARCHIVO = ?`, [idFile])

            if (rows.affectedRows === 0) return res.status(404).json({ status: 404, message: 'File not found' })

            return res.status(200).json({ status: 200, message: 'File moved to recycling bin' })
        } else if (type === 'folder') {
            const [rows, fields] = await db.query(`UPDATE CARPETA SET ELIMINADO = 1 WHERE ID_CARPETA = ?`, [idFile])

            if (rows.affectedRows === 0) return res.status(404).json({ status: 404, message: 'Folder not found' })

            return res.status(200).json({ status: 200, message: 'Folder moved to recycling bin' })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Internal server error' })
    }
}

const restoreFile = async (req, res) => {
    try {
        //sacamos los valores del json
        const { idFile, type } = req.body

        if (!idFile || !type) return res.status(400).json({ status: 400, message: 'Data uncomplete to delete the file' })

        //cambiamos el estado del archivo/ carpeta eliminado

        if (type === 'file') {
            const [rows, fields] = await db.query(`UPDATE ARCHIVO SET ELIMINADO = 0 WHERE ID_ARCHIVO = ?`, [idFile])

            if (rows.affectedRows === 0) return res.status(404).json({ status: 404, message: 'File not found' })

            return res.status(200).json({ status: 200, message: 'File restored' })
        } else if (type === 'folder') {
            const [rows, fields] = await db.query(`UPDATE CARPETA SET ELIMINADO = 0 WHERE ID_CARPETA = ?`, [idFile])

            if (rows.affectedRows === 0) return res.status(404).json({ status: 404, message: 'Folder not found' })

            return res.status(200).json({ status: 200, message: 'Folder restored' })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Internal server error' })
    }
}

const emptyTrash = async (req, res) => {
    try {
        //sacamos los valores del json
        const { idUser } = req.body

        if (!idUser) return res.status(400).json({ status: 400, message: 'Data uncomplete to delete the file' })

        const [rows, fields] = await db.query(`SELECT CUENTA.ID_CUENTA FROM CUENTA where CUENTA.ID_USUARIO = ?`, [idUser])

        if (rows.length === 0) return res.status(404).json({ status: 404, message: 'Account not found' })

        const idCuenta = rows[0].ID_CUENTA;

        //obtenemos los archivos y carpetas hijos de la papelera
        const [rows2, fields2] = await db.query(` SELECT CARPETA.ID_CARPETA,(  SELECT SUM(CANT)
                FROM (
                    SELECT COUNT(*) CANT FROM CARPETA WHERE CARPETA.ID_CARPETA_PADRE = CARPETA.ID_CARPETA 
                    UNION 
                    SELECT COUNT(*) FROM ARCHIVO WHERE ARCHIVO.ID_CARPETA = CARPETA.ID_CARPETA
                    ) AS CHILDREN
            ) AS CHILDREN
            FROM CARPETA WHERE ELIMINADO = 1 and CARPETA.ID_CUENTA = ?`, [idCuenta])

        const [rows3, fields3] = await db.query(`   SELECT ARCHIVO.ID_ARCHIVO, ARCHIVO.KEY_S3
                FROM ARCHIVO INNER JOIN CARPETA on ARCHIVO.ID_CARPETA = CARPETA.ID_CARPETA
                WHERE CARPETA.ID_CUENTA = ? and ARCHIVO.ELIMINADO = 1`, [idCuenta])

        const folders = rows2.map(folder => {
            return {
                id: folder.ID_CARPETA,
                type: 'folder',
                children: folder.CHILDREN
            }
        });

        const files = rows3.map(file => {
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

        const listItems = [...folders, ...files];

        //eliminamos los archivos y carpetas hijos de la papelera
        for (let i = 0; i < listItems.length; i++) {
            if (listItems[i].type === 'folder') {
                await deleteFolder(listItems[i]);
                //eliminamos la carpeta de la base de datos
                await db.query(`DELETE FROM CARPETA WHERE ID_CARPETA = ?`, [listItems[i].id])
            } else if (listItems[i].type === 'file') {
                await deleteObjectS3(listItems[i].key);
                //eliminamos el archivo de la base de datos
                await db.query(`DELETE FROM ARCHIVO WHERE ID_ARCHIVO = ?`, [listItems[i].id])
            }
        }

        return res.status(200).json({ status: 200, message: 'Trash emptied' })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Internal server error' })
    }
}

const deleteFolder = async (folder) => { //funcion recursiva para eliminar carpetas
    try {
        const items = await getFiles(folder.id);
        console.log(items)
        for (let i = 0; i < items.length; i++) {
            if (items[i].type === 'folder') {
                await deleteFolder(items[i]);
                //eliminamos la carpeta de la base de datos
                await db.query(`DELETE FROM CARPETA WHERE ID_CARPETA = ?`, [items[i].id])
            } else if (items[i].type === 'file') {
                await deleteObjectS3(items[i].key);
                //eliminamos el archivo de la base de datos
                await db.query(`DELETE FROM ARCHIVO WHERE ID_ARCHIVO = ?`, [items[i].id])
            }
        }

    }
    catch (error) {
        console.log(error)
    }
}

const getFiles = async (idFolder) => { //funcion para obtener los archivos y carpetas hijos de una carpeta para eliminarlos
    try {

        //retornamos los archivos y carpetas hijos de la carpeta
        const [rows, fields] = await db.query(` SELECT CARPETA.ID_CARPETA
                                                ,(  SELECT SUM(CANT)
                                                    FROM (
                                                        SELECT COUNT(*) CANT FROM CARPETA WHERE CARPETA.ID_CARPETA_PADRE = CARPETA.ID_CARPETA 
                                                        UNION 
                                                        SELECT COUNT(*) FROM ARCHIVO WHERE ARCHIVO.ID_CARPETA = CARPETA.ID_CARPETA
                                                        ) AS CHILDREN
                                                ) AS CHILDREN
                                                FROM CARPETA
                                                WHERE CARPETA.ID_CARPETA_PADRE = ?`, [idFolder])

        const [rows2, fields2] = await db.query(`   SELECT ARCHIVO.ID_ARCHIVO, ARCHIVO.KEY_S3
                                                    FROM ARCHIVO
                                                    WHERE ARCHIVO.ID_CARPETA = ?`, [idFolder])

        const folders = rows.map(folder => {
            return {
                id: folder.ID_CARPETA,
                type: 'folder',
                children: folder.CHILDREN
            }
        });

        const files = rows2.map(file => {
            return {
                id: file.ID_ARCHIVO,
                type: 'file',
                key: file.KEY_S3
            }
        });

        return [...folders, ...files]
    } catch (error) {
        console.log(error)
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
        if (rows.length === 0) {
            await db.query(`UPDATE ${type === 'file' ? 'ARCHIVO' : 'CARPETA'} SET NOMBRE = ? WHERE ID_${type === 'file' ? 'ARCHIVO' : 'CARPETA'} = ?;`, [newName, idRename])
            return res.status(200).json({ status: 200, icon: 'success', message: '' })
        }
        return res.status(202).json({ status: 202, icon: 'warning', message: `The ${type} named ${newName} already exists!` })
    } catch (error) {
        return res.status(500).json({ status: 500, icon: 'error', message: 'Internal server error' })
    }
}

const download = async (req, res) => {
    try {
        const { idFile } = req.body
        const [rows] = await db.query('SELECT KEY_S3 FROM ARCHIVO WHERE ID_ARCHIVO = ?', [idFile])
        const [file] = rows

        return res.status(200).json({ status: 200, icon: 'success', message: '', url: file.KEY_S3 })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, icon: 'error', message: 'Internal server error' })
    }
}

const getFavsItems = async (req, res) => {
    try {
        //sacamos los valores del json
        const { idAccount, idFolder } = req.body

        //retornamos los archivos y carpetas hijos de la carpeta
        const [rows, fields] = await db.query(` SELECT CARPETA.ID_CARPETA, CARPETA.NOMBRE, CARPETA.FAVORITO, CARPETA.CREA, CARPETA.MODIFICA, CARPETA.CREACION, CARPETA.MODIFICACION
                                                ,(  SELECT SUM(CANT)
                                                    FROM (
                                                        SELECT COUNT(*) CANT FROM CARPETA WHERE CARPETA.ID_CARPETA_PADRE = CARPETA.ID_CARPETA 
                                                        UNION 
                                                        SELECT COUNT(*) FROM ARCHIVO WHERE ARCHIVO.ID_CARPETA = CARPETA.ID_CARPETA
                                                        ) AS CHILDREN
                                                ) AS CHILDREN
                                                FROM CARPETA
                                                WHERE ELIMINADO = 0 ${idFolder ? '' : 'and FAVORITO = 1'} and ${idFolder ? 'CARPETA.ID_CARPETA_PADRE = ?' : 'CARPETA.ID_CUENTA = ?'}
                                                ORDER BY CARPETA.NOMBRE ASC`, [idFolder || idAccount])

        const [rows2, fields2] = await db.query(`   SELECT ARCHIVO.ID_ARCHIVO, ARCHIVO.NOMBRE, ARCHIVO.FAVORITO, ARCHIVO.TAMANO_B, ARCHIVO.KEY_S3, ARCHIVO.CREA, ARCHIVO.MODIFICA, ARCHIVO.CREACION, ARCHIVO.MODIFICACION
                                                    FROM ARCHIVO
                                                        INNER JOIN CARPETA on ARCHIVO.ID_CARPETA = CARPETA.ID_CARPETA
                                                    WHERE ARCHIVO.ELIMINADO = 0 ${idFolder ? '' : 'and ARCHIVO.FAVORITO = 1'} and ${idFolder ? 'ARCHIVO.ID_CARPETA = ?' : 'CARPETA.ID_CUENTA = ?'}
                                                    ORDER BY ARCHIVO.NOMBRE ASC`, [idFolder || idAccount])

        const folders = rows.map(folder => {
            return {
                id: folder.ID_CARPETA,
                name: folder.NOMBRE,
                favorite: folder.FAVORITO,
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
                favorite: file.FAVORITO,
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

const setFavItem = async (req, res) => {
    try {
        const { idItem, type } = req.body
        const [rows] = await db.query(`SELECT FAVORITO FROM ${type === 'file' ? 'ARCHIVO' : 'CARPETA'} WHERE ID_${type === 'file' ? 'ARCHIVO' : 'CARPETA'} = ?`, [idItem])
        const [item] = rows
        await db.query(`UPDATE ${type === 'file' ? 'ARCHIVO' : 'CARPETA'} SET FAVORITO = ? WHERE ID_${type === 'file' ? 'ARCHIVO' : 'CARPETA'} = ?`, [item.FAVORITO === 0 ? 1 : 0, idItem])
        return res.status(200).json({ status: 200, icon: 'success', message: '', fav: item.FAVORITO === 0 ? 1 : 0 })
    } catch (error) {
        return res.status(500).json({ status: 500, icon: 'error', message: 'Internal server error' })
    }
}

export const files = {
    getRootFolder,
    getChildItems,
    uploadFile,
    createFolder,
    deleteFile,
    getDeletedItems,
    restoreFile,
    emptyTrash,
    rename,
    download,
    getFavsItems,
    setFavItem,
    addFolderTags,
    getFolderTags,
}