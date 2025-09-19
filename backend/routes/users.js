const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/users?search=...
// Searches for users by username
router.get('/', authMiddleware, async (req, res) => {
  try {
    const searchQuery = req.query.search
      ? {
          username: {
            // '$regex' provides pattern-matching (like SQL's 'LIKE')
            // '$options: "i"' makes the search case-insensitive
            $regex: req.query.search,
            $options: 'i',
          },
        }
      : {};

    // Find users based on the search query, excluding the logged-in user
    const users = await User.find(searchQuery).find({ _id: { $ne: req.user.id } }).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;