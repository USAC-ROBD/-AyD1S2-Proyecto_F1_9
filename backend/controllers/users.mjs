import db from "../utils/db_connection.mjs";

const getCountries = async (req, res) => {
    const [rows, fields] = await db.query('SELECT ID_PAIS AS id, NOMBRE AS name, CODIGO AS code FROM AYD_STORAGE.PAIS;')
    return res.status(200).json({status: 200, data: rows})
}

const login = async (req, res) => {
    const { userEmail, password } = req.query
    const [rows, fields] = await db.query(`SELECT ID_USUARIO, NOMBRE, APELLIDO, USUARIO, EMAIL FROM USUARIO WHERE (USUARIO = ? OR EMAIL = ?) AND CONTRASENA = SHA2(?, 256)`, [userEmail, userEmail, password])

    if(rows.length > 0) {
        return res.status(200).json({status: 200, icon: 'success', message: `Welcome ${rows[0].NOMBRE}`, data: rows[0]})
    }
    res.status(202).json({status: 202, icon: 'warning', message: 'Check your credentials!'})
}

const signup = async (req, res) => {
    const {name, lastName, username, password, email, phone, country, nationality} = req.body

    const [rows, fields] = await db.query(`SELECT 
            CASE
                WHEN EXISTS (SELECT 1 FROM USUARIO WHERE USUARIO = ?) AND EXISTS (SELECT 1 FROM USUARIO WHERE EMAIL = ?) THEN 'The username and email are already registered'
                WHEN EXISTS (SELECT 1 FROM USUARIO WHERE USUARIO = ?) THEN 'The username is already registered'
                WHEN EXISTS (SELECT 1 FROM USUARIO WHERE EMAIL = ?) THEN 'The email is already registered'
            END AS message
        WHERE EXISTS (SELECT 1 FROM USUARIO WHERE USUARIO = ? OR EMAIL = ?)`,
        [username, email, username, email, username, email]
    )

    if(rows.length === 0) {
        await db.query(`INSERT INTO USUARIO(
            NOMBRE, APELLIDO, USUARIO, CONTRASENA, EMAIL, CELULAR, PAIS_RESIDENCIA, NACIONALIDAD, ROL
        ) VALUES (
            ?, ?, ?, SHA2(?, 256), ?, ?, ?, ?, ?
        )`, [name, lastName, username, password, email, phone, country, nationality, 2])
        return res.status(200).json({status: 200, icon: 'success', message: 'Signed up successfully!'})
    }
    res.status(202).json({status: 202, icon: 'warning', message: rows[0].message})
}

export const users = {
    getCountries,
    login,
    signup,
}