import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Received username:', username);
    console.log('Received password:', password);
    console.log('Expected username:', process.env.DASHBOARD_USERNAME);
    console.log('Expected password:', process.env.DASHBOARD_PASSWORD);

    if (username !== process.env.DASHBOARD_USERNAME) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (password !== process.env.DASHBOARD_PASSWORD) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;