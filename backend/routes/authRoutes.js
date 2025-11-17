const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id, username, role
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Add role here
      const userData = { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      };

      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({
        message: 'Login successful',
        token,
        user: userData
      });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected route to verify token
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Protected data', 
    user: req.user  // includes role
  });
});

// Change username
router.put('/change-username', authenticateToken, async (req, res) => {
  const { oldUsername, newUsername } = req.body;

  if (!oldUsername || !newUsername) {
    return res.status(400).json({ error: 'Old username and new username are required' });
  }

  if (oldUsername !== req.user.username) {
    return res.status(401).json({ error: 'Old username does not match current user' });
  }

  try {
    db.query('SELECT * FROM users WHERE username = ?', [newUsername], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'New username is already taken' });
      }

      db.query(
        'UPDATE users SET username = ? WHERE id = ?',
        [newUsername, req.user.id],
        (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
          }

          // Keep role the same after username change
          const userData = { 
            id: req.user.id, 
            username: newUsername, 
            role: req.user.role 
          };

          const newToken = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });

          res.json({
            message: 'Username updated successfully',
            token: newToken,
            user: userData
          });
        }
      );
    });
  } catch (err) {
    console.error('Error changing username:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'Old password, new password, and confirmation are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New password and confirmation do not match' });
  }

  try {
    db.query('SELECT password FROM users WHERE id = ?', [req.user.id], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = results[0];
      const match = await bcrypt.compare(oldPassword, user.password);

      if (!match) {
        return res.status(401).json({ error: 'Old password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      db.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, req.user.id],
        (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
          }

          res.json({ message: 'Password updated successfully' });
        }
      );
    });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
