import { supabaseAdmin } from './_db.js';
import { sendWhatsAppMessage } from './_send.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { phone, user_id } = req.body;
    if (!phone || !user_id) return res.status(400).json({ error: 'Missing phone or user ID' });

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    // Save/update OTP in database
    const { error: dbError } = await supabaseAdmin
        .from('users')
        .upsert({ id: user_id, phone, otp, otp_expires_at: expiresAt, subscribed: false });

    if (dbError) return res.status(500).json({ error: dbError.message });

    try {
        await sendWhatsAppMessage(phone, `Your Limn Engine verification code is: *${otp}*. It expires in 10 minutes.`);
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to send WhatsApp message' });
    }
}
