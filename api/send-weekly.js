import { supabaseAdmin } from './_db.js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    const { data: users, error } = await supabaseAdmin
        .from('users')
        .select('email')
        .eq('subscribed', true);

    if (error) return res.status(500).json({ error: error.message });

    const subject = 'Limn Engine Weekly Update';
    const htmlContent = '<p>Check out what\'s new in game creation this week!</p>';

    await supabaseAdmin
        .from('notifications')
        .insert([{ title: subject, content: htmlContent }]);

    let successCount = 0;
    for (const user of users) {
        if (!user.email) continue;
        
        try {
            await resend.emails.send({
                from: 'Limn Engine <onboarding@resend.dev>',
                to: user.email,
                subject: subject,
                html: htmlContent,
            });
            successCount++;
        } catch (err) {
            console.error(`Failed to send to ${user.email}:`, err.message);
        }
    }

    return res.status(200).json({ success: true, sent: successCount });
        }
    
