import db from "../utils/db_connection.mjs"
import { transporter, getMailOptions, warningMail } from '../email/nodemailer.mjs'

const getCountries = async (req, res) => {
    const [rows, fields] = await db.query('SELECT ID_PAIS AS id, NOMBRE AS name, CODIGO AS code FROM AYD_STORAGE.PAIS')
    return res.status(200).json({status: 200, data: rows})
}

const login = async (req, res) => {
    const { userEmail, password } = req.query
    const [rows, fields] = await db.query(`SELECT
        ID_USUARIO,
        NOMBRE,
        APELLIDO,
        USUARIO,
        EMAIL,
        CONFIRMADO,
        ROL,
        CELULAR,
        NACIONALIDAD,
        (SELECT NOMBRE FROM PAIS WHERE ID_PAIS = PAIS_RESIDENCIA) AS PAIS_RESIDENCIA
    FROM USUARIO
    WHERE (USUARIO = ? OR EMAIL = ?) AND CONTRASENA = SHA2(?, 256)`, [userEmail, userEmail, password])

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
        
        const confirmationLink = `${process.env.REACT_APP_API_HOST}/confirmation/${result.insertId}`
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

const updateProfile = async (req, res) => {
    let updates = ''
    let params = []
    const { ID_USUARIO, changes } = req.body
    for(const key of Object.keys(changes)) {
        updates += `${updates !== '' ? ', ' : ''}${key} = ?`
        params.push(changes[key])
    }
    await db.query(`UPDATE USUARIO SET ${updates} WHERE ID_USUARIO = ?`, [...params, ID_USUARIO])
    return res.status(200).json({status: 200, icon: 'success', message: 'Account uploaded!'})
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
        // Obtener el nombre de usuario (username) basado en el id_cuenta
        const usernameQuery = `
            SELECT u.USUARIO AS username
            FROM CUENTA c
            JOIN USUARIO u ON c.ID_USUARIO = u.ID_USUARIO
            WHERE c.ID_CUENTA = ?
        `;
        const [userRows] = await db.query(usernameQuery, [id_cuenta]);

        if (!userRows.length) {
            return res.status(400).json({ status: 400, message: 'La cuenta no existe' });
        }

        const username = userRows[0].username;

        // Realizar el POST a la API getStorage para obtener el almacenamiento
        const storageResponse = await fetch(`${process.env.REACT_APP_API_HOST}/getStorage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "username":username })
        });

        if (!storageResponse.ok) {
            throw new Error('Error al obtener el almacenamiento de la cuenta');
        }

        const storageData = await storageResponse.json();
        const usedStorage = parseFloat(storageData.used);  // Almacenamiento usado en GB

        // Obtener la capacidad del nuevo paquete
        const packageQuery = `
            SELECT CAPACIDAD_GB FROM PAQUETE WHERE ID_PAQUETE = ?
        `;
        const [packageRows] = await db.query(packageQuery, [id_paquete]);

        if (!packageRows.length) {
            return res.status(400).json({ status: 400, message: 'El paquete seleccionado no existe' });
        }

        const newPackageCapacity = packageRows[0].CAPACIDAD_GB;

        // Comprobar si el almacenamiento usado excede el nuevo paquete
        if (usedStorage > newPackageCapacity) {
            return res.status(400).json({
                status: 400,
                message: `El almacenamiento usado (${usedStorage} GB) excede la capacidad del paquete seleccionado (${newPackageCapacity} GB). No se puede actualizar.`
            });
        }

        // Si no excede, proceder a actualizar el paquete en la cuenta
        const updateQuery = `
            UPDATE CUENTA
            SET ID_PAQUETE = ?
            WHERE ID_CUENTA = ?
        `;

        await db.query(updateQuery, [id_paquete, id_cuenta]);

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

                // Insertar la carpeta raíz asociada a la cuenta
                await db.query(`
                    INSERT INTO CARPETA(NOMBRE, ID_CARPETA_PADRE, ID_CUENTA) VALUES ('', NULL, ?)`,
                    [result2.insertId]);
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

const warningAccount = async (req, res) => {
    const { id_cuenta } = req.body;

    if (!id_cuenta) {
        return res.status(400).json({ status: 400, message: 'Faltan datos para actualizar el estado de la cuenta' });
    }

    try {
        // Verificar si la cuenta existe y obtener detalles como el email asociado
        const accountQuery = `
            SELECT ID_CUENTA, EMAIL, NOMBRE
            FROM CUENTA
            JOIN USUARIO ON CUENTA.ID_USUARIO = USUARIO.ID_USUARIO
            WHERE ID_CUENTA = ?
        `;
        const [accountRows] = await db.query(accountQuery, [id_cuenta]);

        if (!accountRows.length) {
            return res.status(400).json({ status: 400, message: 'La cuenta no existe' });
        }

        const { EMAIL: email, NOMBRE: name } = accountRows[0];

        // Actualizar el estado de ELIMINADO a 2
        const updateQuery = `
            UPDATE CUENTA
            SET ELIMINADO = 2
            WHERE ID_CUENTA = ?
        `;
        await db.query(updateQuery, [id_cuenta]);

        // Generar el enlace de advertencia (puedes cambiar el enlace como necesites)
        const warningLink = `${process.env.FRONT_URL}/confirmationWarning/${id_cuenta}`;

        // Configurar las opciones del correo de advertencia
        const mailOptions = warningMail(email, name, warningLink);

        // Enviar el correo de advertencia
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ status: 500, message: 'Error al enviar el correo de advertencia' });
            }
        });

        return res.status(200).json({ status: 200, message: 'Estado de la cuenta actualizado a ELIMINADO = 2 y correo enviado' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error al actualizar el estado de la cuenta' });
    }
};

const confirmationWarning = async (req, res) => {
    const { id_cuenta } = req.body;

    if (!id_cuenta) {
        return res.status(400).json({ status: 400, message: 'Faltan datos para confirmar la cuenta' });
    }

    try {
        // Buscar la cuenta en la base de datos con el estado ELIMINADO = 2
        const accountQuery = `
            SELECT ID_CUENTA, NOMBRE
            FROM CUENTA
            JOIN USUARIO ON CUENTA.ID_USUARIO = USUARIO.ID_USUARIO
            WHERE ID_CUENTA = ? AND ELIMINADO = 2
        `;
        const [accountRows] = await db.query(accountQuery, [id_cuenta]);

        if (!accountRows.length) {
            return res.status(400).json({ status: 400, message: 'No se encontró la cuenta o no está en estado ELIMINADO = 2' });
        }

        const { NOMBRE: name } = accountRows[0];

        // Actualizar el estado de ELIMINADO a 0
        const updateQuery = `
            UPDATE CUENTA
            SET ELIMINADO = 0
            WHERE ID_CUENTA = ?
        `;
        await db.query(updateQuery, [id_cuenta]);

        return res.status(200).json({ status: 200, icon: 'success', message: `¡Cuenta confirmada! Bienvenido de nuevo, ${name}.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error al confirmar la cuenta' });
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
    updateProfile,
    warningAccount,
    confirmationWarning,
}