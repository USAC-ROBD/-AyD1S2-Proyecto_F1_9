import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_ORIGIN, // Cambia esto por tu correo
        pass: process.env.APP_KEY // Cambia esto por la contraseña de tu correo
    }
})

export const getMailOptions = (email, name, confirmationLink) => {
    return {
        from: process.env.EMAIL_ORIGIN,
        to: email,
        subject: 'Confirm your account of AyDStorage',
        html: `<p>Hello ${name},</p>
            <p>Please confirm your account by clicking the link below:</p>
            <a href="${confirmationLink}">Confirm Account</a>`
    }
}