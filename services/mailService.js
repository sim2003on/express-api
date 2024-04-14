import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

const HOST = process.env.SMTP_HOST;
const PORT = process.env.SMTP_PORT;
const USER = process.env.SMTP_USER;
const PASSWORD = process.env.SMTP_PASSWORD;

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: HOST,
            port: PORT,
            secure: false,
            auth: {
                user: USER,
                pass: PASSWORD,
            },
        });
    }

    async sendActivationMail(email, link) {
        await this.transporter.sendMail({
            from: USER,
            to: email,
            subject: 'Активация аккаунта',
            text: '',
            html: `
				<div>
					<h1>Centre61 Support</h1>
					<h3>Для активации перейдите по ссылке</h3>
					<a href=${process.env.API_URL}/api/auth/activate/${link}">${process.env.API_URL}/api/auth/activate/${link}</a>
				</div>
			`,
        });
    }

    async sendResetPasswordMail(email, token) {
        const link = `${process.env.CLIENT_URL}/admin/reset-password/${token}`;
        await this.transporter.sendMail({
            from: USER,
            to: email,
            subject: 'Сброс пароля',
            text: '',
            html: `
				<div>
					<h1>Centre61 Support</h1>
					<h3>Для сброса пароля перейдите по ссылке</h3>
					<a href="${link}">${link}</a>
				</div>
			`,
        });
    }
}

export default new MailService();
