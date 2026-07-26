import pool from '../db/connect.js';

async function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    const result = await pool.query(
      'SELECT price FROM products WHERE LOWER(name) LIKE LOWER($1) LIMIT 1',
      [`%${item.name}%`]
    );
    if (result.rows.length > 0) {
      total += parseFloat(result.rows[0].price) * item.quantity;
    }
  }
  return total;
}

export async function saveOrder(customerPhone, orderDetails) {
  const { customer_name, items, delivery_time } = orderDetails;

  const total_amount = await calculateTotal(items);

  const result = await pool.query(
    `INSERT INTO orders 
    (customer_phone, customer_name, items, delivery_time, total_amount, status)
    VALUES ($1, $2, $3, $4, $5, 'new')
    RETURNING *`,
    [customerPhone, customer_name, JSON.stringify(items), delivery_time, total_amount]
  );

  return result.rows[0];
}

export async function getAllOrders() {
  const result = await pool.query(
    'SELECT * FROM orders ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function updateOrderStatus(orderId, status) {
  const result = await pool.query(
    'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
    [status, orderId]
  );
  return result.rows[0];
}