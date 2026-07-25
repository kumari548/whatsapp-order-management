import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import customersRouter from './routes/customers.js';
import deliveriesRouter from './routes/deliveries.js';import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import webhookRouter from './routes/webhook.js';
import ordersRouter from './routes/orders.js';
import inventoryRouter from './routes/inventory.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again later.'
});

app.use('/webhook', limiter);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/webhook', webhookRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/inventory',inventoryRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/customers', customersRouter);
app.use('/api/deliveries', deliveriesRouter);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong', message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;