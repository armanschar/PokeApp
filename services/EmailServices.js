import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function sendEmail({to, subject, html}) {
    try {
        const info = await transporter.sendMail({
            from: `${process.env.EMAIL_USER}`,
            to,
            subject,
            html
        });
        console.log('Email sent: ' + info.response);
        return info;
    }catch (error) {
        console.error("Error sending email:", error);
    }
}