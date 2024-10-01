import configurations from "../utils/configurations.mjs";
import db from "../utils/db_connection.mjs";
import { transporter, deleteMail } from '../email/nodemailer.mjs'

const deleteAccountRequest = async (req, res) => {

    const { email } = req.body;
    
    try {
        const user = await db.query("SELECT * FROM USUARIO WHERE EMAIL = ?", [email]);
        if (user[0].length === 0) {
            return res.status(404).json({ "status": 404, "message": "Correo electrónico no encontrado " + configurations.host + ":" + configurations.port });
        }

        const [dataUser, fields] = user
        const confirmationLink = `${process.env.FRONT_URL}/deleteAccount?email=${email}`
        const mailOptions = deleteMail(email, dataUser[0].NOMBRE, confirmationLink)

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.log(error)
                return res.status(500).json({status: 500, icon: 'error', message: 'Error sending confirmation email!'})
            }
        })

        return res.status(200).json({ "status": 200, "data": user[0][0], "message": "Usuario encontrado " + configurations.host + ":" + configurations.port});
        
    } catch (error) {
        console.error("Error al verificar el correo electrónico:", error);
        return res.status(500).json({ "status": 500, "message": "Error al verificar el correo electrónico " + configurations.host + ":" + configurations.port, "error": error.message });
    }
};

export const deleteAccountRequestUser = { deleteAccountRequest };