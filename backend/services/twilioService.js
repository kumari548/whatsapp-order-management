import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppMessage(to, message) {
  try {
    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`,
      body: message,
    });
    console.log('Message sent successfully:', response.sid);
    return response;
  } catch (err) {
    console.error('Failed to send message:', err);
    throw err;
  }
}

export function buildOrderConfirmation(orderDetails) {
  const itemsList = orderDetails.items
    .map(item => `• ${item.quantity} ${item.unit} ${item.name}`)
    .join('\n');

  return `✅ *Order Confirmed!*

Hi ${orderDetails.customer_name || 'there'}! Your order has been received:

${itemsList}

🕐 Delivery: ${orderDetails.delivery_time || 'Will be confirmed soon'}

Thank you for ordering! We will contact you shortly.`;
}