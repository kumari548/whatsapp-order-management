import express from 'express';
import { parseOrder } from '../services/aiParser.js';
import { sendWhatsAppMessage, buildOrderConfirmation } from '../services/twilioService.js';
import { saveOrder } from '../services/orderService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const rawMessage = req.body.Body;
    const incomingMessage = rawMessage.trim().slice(0, 500).replace(/[<>{}]/g, '');
    const customerPhone = req.body.From.replace('whatsapp:', '').trim();

    console.log(`Message from ${customerPhone}: ${incomingMessage}`);

    const orderDetails = await parseOrder(incomingMessage);

    if (!orderDetails || !orderDetails.items.length) {
      await sendWhatsAppMessage(customerPhone,
        'Sorry, I could not understand your order. Please try again like: "1kg rice, 2 oil, deliver by 6pm"'
      );
      return res.status(200).send('OK');
    }

    await saveOrder(customerPhone, orderDetails);

    const confirmationMessage = buildOrderConfirmation(orderDetails);
    await sendWhatsAppMessage(customerPhone, confirmationMessage);

    console.log('Order saved and confirmation sent!');
    res.status(200).send('OK');

  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).send('Error');
  }
});

export default router;