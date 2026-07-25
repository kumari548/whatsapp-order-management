import express from 'express';
import pool from '../db/connect.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventory ORDER BY item_name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { item_name, quantity, unit, low_stock_alert } = req.body;
    const result = await pool.query(
      'INSERT INTO inventory (item_name, quantity, unit, low_stock_alert) VALUES ($1, $2, $3, $4) RETURNING *',
      [item_name, quantity, unit, low_stock_alert]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, item_name, unit, low_stock_alert } = req.body;
    const result = await pool.query(
      'UPDATE inventory SET quantity = COALESCE($1, quantity), item_name = COALESCE($2, item_name), unit = COALESCE($3, unit), low_stock_alert = COALESCE($4, low_stock_alert) WHERE id = $5 RETURNING *',
      [quantity, item_name, unit, low_stock_alert, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

export default router;