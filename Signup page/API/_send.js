import axios from 'axios';

export async function sendWhatsAppMessage(phone, message) {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;

    await axios.post(
        `https://graph.facebook.com/v18.0/${phoneId}/messages`,
        {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'text',
            text: { body: message }
        },
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
}
