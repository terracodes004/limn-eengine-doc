import { supabaseAdmin } from './_db.js';
import { sendEmail } from './_send.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { email, user_id } = req.body;
    if (!email || !user_id) return res.status(400).json({ error: 'Missing email or user ID' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { error: dbError } = await supabaseAdmin
        .from('users')
        .upsert({ id: user_id, email, otp, otp_expires_at: expiresAt, subscribed: false });

    if (dbError) return res.status(500).json({ error: dbError.message });

    try {
        await sendEmail(
            email, 
            'Your Verification Code', 
            `<p>Your Limn Engine verification code is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`
        );
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to send email' });
    }
}
