import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'maddison53@ethereal.email',
        pass: 'jn7jnAPss4f63QBp6D',
    },
});

export const sendActivationMail = async (email, link) => {
    await transporter.sendMail({
        from: 'maddison53@ethereal.email',
        to: email,
        subject: 'Активация аккаунта',
        text: '',
        html: `
			<div>
				<h1>Для активации перейдите по ссылке</h1>
				<a href="${link}">${link}</a>
			</div>
		`,
    });
};

export const sendResetPasswordMail = async (email, link) => {
    await transporter.sendMail({
        from: 'maddison53@ethereal.email',
        to: email,
        subject: 'Сброс пароля',
        text: '',
        html: `
			<div>
				<h1>Для сброса пароля перейдите по ссылке</h1>
				<a href="${link}">${link}</a>
			</div>
		`,
    });
};
