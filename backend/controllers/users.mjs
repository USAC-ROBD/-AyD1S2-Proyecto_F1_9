import db from "../utils/db_connection.mjs"
import { transporter, getMailOptions } from '../email/nodemailer.mjs'

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

export const users = {
    getCountries,
    login,
    signup,
    confirmation,
}