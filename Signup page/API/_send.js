import nodemailer from 'nodemailer';

export async function sendEmail(to, subject, htmlContent) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: process.env.GMAIL_USER,   
        to: to,                         
        subject: subject,
        html: htmlContent,             
    });
}
