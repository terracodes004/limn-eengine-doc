import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to, subject, htmlContent) {
    return await resend.emails.send({
        from: 'Limn Engine <onboarding@resend.dev>',
        to,
        subject,
        html: htmlContent,
    });
}
