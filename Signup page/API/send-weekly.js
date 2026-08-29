import { supabaseAdmin } from './_db.js';
import { sendWhatsAppMessage } from './_send.js';

export default async function handler(req, res) {
    const { data: users, error } = await supabaseAdmin
        .from('users')
        .select('phone')
        .eq('subscribed', true);

    if (error) return res.status(500).json({ error: error.message });

    const message = "🚀 *Limn Engine Weekly Update:* Check out what's new in game creation this week!";

    let successCount = 0;
    for (const user of users) {
        try {
            await sendWhatsAppMessage(user.phone, message);
            successCount++;
        } catch (err) {
            console.error(`Failed to send to ${user.phone}:`, err.message);
        }
    }

    return res.status(200).json({ success: true, sent: successCount });
}
