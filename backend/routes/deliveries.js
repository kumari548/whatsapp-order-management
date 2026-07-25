import express from 'express';
import pool from '../db/connect.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, o.customer_name, o.customer_phone, o.items, o.delivery_time
      FROM deliveries d
      JOIN orders o ON d.order_id = o.id
      ORDER BY d.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { order_id, delivery_person, estimated_time } = req.body;
    const result = await pool.query(
      'INSERT INTO deliveries (order_id, delivery_person, estimated_time) VALUES ($1, $2, $3) RETURNING *',
      [order_id, delivery_person, estimated_time]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create delivery' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE deliveries SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update delivery' });
  }
});

export default router;