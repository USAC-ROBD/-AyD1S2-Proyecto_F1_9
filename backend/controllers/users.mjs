import AWS from 'aws-sdk';
import crypto from 'crypto';
import db from "../utils/db_connection.mjs"
import { transporter, getMailOptions } from '../email/nodemailer.mjs'

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});
const s3 = new AWS.S3();

const getCountries = async (req, res) => {
    const [rows, fields] = await db.query('SELECT ID_PAIS AS id, NOMBRE AS name, CODIGO AS code FROM AYD_STORAGE.PAIS')
    return res.status(200).json({status: 200, data: rows})
}

const login = async (req, res) => {
    const { userEmail, password } = req.query
    const [rows, fields] = await db.query(`SELECT ID_USUARIO, NOMBRE, APELLIDO, USUARIO, EMAIL, CONFIRMADO, ROL FROM USUARIO WHERE (USUARIO = ? OR EMAIL = ?) AND CONTRASENA = SHA2(?, 256)`, [userEmail, userEmail, password])

    if(rows.length > 0) {
        if(rows[0].CONFIRMADO === 0) {
            return res.status(202).json({status: 202, icon: 'warning', message: `${rows[0].NOMBRE}\nYour registration has not been completed yet!\nPlease check your email`, data: rows[0]})
        }
        return res.status(200).json({status: 200, icon: 'success', message: `Welcome ${rows[0].NOMBRE}`, data: rows[0]})
    }
    res.status(202).json({status: 202, icon: 'warning', message: 'Check your credentials!'})
}

const signup = async (req, res) => {
    const {name, lastName, username, password, email, phone, country, nationality, plan} = req.body
    const [rows, fields] = await db.query(`SELECT 
            CASE
                WHEN EXISTS (SELECT 1 FROM USUARIO WHERE USUARIO = ?) AND EXISTS (SELECT 1 FROM USUARIO WHERE EMAIL = ?) THEN 'The username and email are already registered'
                WHEN EXISTS (SELECT 1 FROM USUARIO WHERE USUARIO = ?) THEN 'The username is already registered'
                WHEN EXISTS (SELECT 1 FROM USUARIO WHERE EMAIL = ?) THEN 'The email is already registered'
            END AS message
        WHERE EXISTS (SELECT 1 FROM USUARIO WHERE USUARIO = ? OR EMAIL = ?)`,
        [username, email, username, email, username, email])

    if(rows.length === 0) {
        const [result] = await db.query(`
            INSERT INTO USUARIO(
                NOMBRE, APELLIDO, USUARIO, CONTRASENA, EMAIL, CELULAR, PAIS_RESIDENCIA, NACIONALIDAD, ROL
            ) VALUES (
                ?, ?, ?, SHA2(?, 256), ?, ?, ?, ?, ?
            )
        `, [name, lastName, username, password, email, phone, country, nationality, 2])

        // insert de la cuenta asociada al usuario

        const [result2] = await db.query(`
            INSERT INTO CUENTA(
                ID_USUARIO, ID_PAQUETE, FECHA_CREACION
            ) VALUES (
                ?, ?, current_date()
            )
        `, [result.insertId, plan])

        // insert de la carpeta raiz asociada a la cuenta

        const [result3] = await db.query(`
            INSERT INTO CARPETA(NOMBRE, ID_CARPETA_PADRE, ID_CUENTA) VALUES ('', NULL, ?)`, [result2.insertId])
        
        const confirmationLink = `${process.env.FRONT_URL}/confirmation/${result.insertId}`
        const mailOptions = getMailOptions(email, name, confirmationLink)

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return res.status(500).json({status: 500, icon: 'error', message: 'Error sending confirmation email!'})
            }
        })
        return res.status(200).json({status: 200, icon: 'success', message: 'Signed up successfully! Check your email to confirm your account!'})
    }
    res.status(202).json({status: 202, icon: 'warning', message: rows[0].message})
}

const confirmation = async (req, res) => {
    const {id} = req.query
    const [rows, fields] = await db.query(`SELECT NOMBRE, APELLIDO FROM USUARIO WHERE ID_USUARIO = ? AND CONFIRMADO = FALSE`, [id])

    if(rows.length > 0) {
        await db.query(`UPDATE USUARIO SET CONFIRMADO = TRUE WHERE ID_USUARIO = ?`, [id])
        return res.status(200).json({status: 200, icon: 'success', message: `Account confirmed!\n${rows[0].NOMBRE}\n${rows[0].APELLIDO}`})
    }
    return res.status(202).json({status: 202, icon: 'warning'})
}

const getAllAccounts = async (req, res) => {
    try {
        const query = `
            SELECT
                u.USUARIO AS usuario,
                u.ID_USUARIO as id_usuario,
                cu.ID_CUENTA as id_cuenta,
                p.ID_PAQUETE AS id_paquete
            FROM
                USUARIO u
                INNER JOIN CUENTA cu ON u.ID_USUARIO = cu.ID_USUARIO
                LEFT JOIN PAQUETE p ON cu.ID_PAQUETE = p.ID_PAQUETE
            WHERE
                cu.ELIMINADO = 0;
        `;
        
        const [rows, fields] = await db.query(query);

        return res.status(200).json({ status: 200, data: rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error fetching accounts' });
    }
};

const updateAccounts = async (req, res) => {
    const { id_cuenta, id_paquete } = req.body;

    if (!id_cuenta || !id_paquete) {
        return res.status(400).json({ status: 400, message: 'Faltan datos para actualizar la cuenta' });
    }

    try {
        const query = `
            UPDATE CUENTA
            SET ID_PAQUETE = ?
            WHERE ID_CUENTA = ?
        `;

        await db.query(query, [id_paquete, id_cuenta]);

        return res.status(200).json({ status: 200, message: 'Cuenta actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error al actualizar la cuenta' });
    }
};


const createAccount = async (req, res) => {
    const {
        name, lastName, username, password, email, phone, country, nationality, role, storagePackage, confirmado, crea
    } = req.body;
    if (!name || !lastName || !username || !password || !email || !phone || !country || !nationality || !role || !storagePackage) {
        return res.status(400).json({ status: 400, icon: 'error', message: 'Missing required fields' });
    }

    try {
        const [rows] = await db.query(`
            SELECT 
                CASE
                    WHEN EXISTS (SELECT 1 FROM USUARIO WHERE USUARIO = ?) AND EXISTS (SELECT 1 FROM USUARIO WHERE EMAIL = ?) THEN 'El nombre de usuario y el correo electrónico ya están registrados'
                    WHEN EXISTS (SELECT 1 FROM USUARIO WHERE USUARIO = ?) THEN 'El nombre de usuario ya está registrado'
                    WHEN EXISTS (SELECT 1 FROM USUARIO WHERE EMAIL = ?) THEN 'El correo electrónico ya está registrado'
                END AS message
            WHERE EXISTS (SELECT 1 FROM USUARIO WHERE USUARIO = ? OR EMAIL = ?)`,
            [username, email, username, email, username, email]);

        if (rows.length === 0) {
            // Insertar el nuevo usuario
            const [result] = await db.query(`
                INSERT INTO USUARIO(
                    NOMBRE, APELLIDO, USUARIO, CONTRASENA, EMAIL, CELULAR, PAIS_RESIDENCIA, NACIONALIDAD, ROL, CONFIRMADO, CREA
                ) VALUES (
                    ?, ?, ?, SHA2(?, 256), ?, ?, ?, ?, ?, ?, ?
                )`,
                [name, lastName, username, password, email, phone, country, nationality, role, confirmado, crea]);

            if (storagePackage !== 4) {
                // Insertar la cuenta asociada al usuario
                const [result2] = await db.query(`
                    INSERT INTO CUENTA(
                        ID_USUARIO, ID_PAQUETE, FECHA_CREACION , CREA
                    ) VALUES (
                        ?, ?, CURRENT_DATE(), ?
                    )`,
                    [result.insertId, storagePackage, crea]);

                // Generar un ID aleatorio para la carpeta raíz
                const folderId = crypto.randomUUID();

                // Crear una carpeta en AWS S3
                const folderName = `${username}_${folderId}`;
                const params = {
                    Bucket: process.env.BUCKET,
                    Key: `${folderName}/`,
                    Body: '', // No es necesario añadir contenido, solo la carpeta
                };

                await s3.putObject(params).promise();

                // Insertar la carpeta raíz asociada a la cuenta
                await db.query(`
                    INSERT INTO CARPETA(NOMBRE, ID_CARPETA_PADRE, ID_CUENTA) VALUES (?, NULL, ?)`,
                    [folderName, result2.insertId]);
            }

            // Enviar el correo de confirmación
            const confirmationLink = `${process.env.FRONT_URL}/confirmation/${result.insertId}`;
            const mailOptions = getMailOptions(email, name, confirmationLink);

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ status: 500, icon: 'error', message: 'Error al enviar el correo de confirmación!' });
                }
            });

            return res.status(200).json({ status: 200, icon: 'success', message: '¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.' });
        } else {
            return res.status(202).json({ status: 202, icon: 'warning', message: rows[0].message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, icon: 'error', message: 'Error al crear el usuario' });
    }
};


export const users = {
    getCountries,
    login,
    signup,
    confirmation,
    getAllAccounts,
    updateAccounts,
    createAccount,
}