const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const router = express.Router();

// ## REGISTER ROUTE ##

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;


    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }


    user = new User({ username, email, password });
    await user.save();
    res.status(201).send('User registered successfully');

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ## LOGIN ROUTE ##
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        

        res.json({
          token,
          user: {
            id: user.id,
            username: user.username
          }
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;