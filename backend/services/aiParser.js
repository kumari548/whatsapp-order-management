import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function parseOrder(message) {
  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `You are an order parser for a small shop.
Extract order details from this WhatsApp message and return ONLY a JSON object with no extra text.

Message: "${message}"

Return this exact format:
{
  "customer_name": "name or null",
  "items": [
    { "name": "item name", "quantity": 1, "unit": "kg/piece/litre" }
  ],
  "delivery_time": "time mentioned or null",
  "total_amount": null
}`,
      },
    ],
  });

  try {
    const text = response.choices[0].message.content;
    const parsed = JSON.parse(text);
    return parsed;
  } catch (err) {
    console.error('Failed to parse AI response:', err);
    return null;
  }
}