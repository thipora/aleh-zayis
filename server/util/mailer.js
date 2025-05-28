import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendMail = async (params) => {
    try {
        let info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: params.to,
            subject: params.subject,
            html: params.html
        });

        return info;
    } catch (error) {
        console.log(error);
        return false;
    }
};
