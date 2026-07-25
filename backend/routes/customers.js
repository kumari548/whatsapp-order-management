import express from 'express';
import pool from '../db/connect.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT customer_phone, customer_name,
      COUNT(*) as total_orders,
      MAX(created_at) as last_order_at
      FROM orders
      GROUP BY customer_phone, customer_name
      ORDER BY total_orders DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

export default router;