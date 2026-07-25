import express from 'express';
import pool from '../db/connect.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, price, category_id, stock, unit, image_url } = req.body;
    const result = await pool.query(
      'INSERT INTO products (name, price, category_id, stock, unit, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, price, category_id, stock, unit, image_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category_id, stock, unit, image_url } = req.body;
    const result = await pool.query(
      'UPDATE products SET name=COALESCE($1,name), price=COALESCE($2,price), category_id=COALESCE($3,category_id), stock=COALESCE($4,stock), unit=COALESCE($5,unit), image_url=COALESCE($6,image_url) WHERE id=$7 RETURNING *',
      [name, price, category_id, stock, unit, image_url, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;