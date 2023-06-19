const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const {sep} = require("path");
const path = require("path");
const jwt = require('jsonwebtoken');

const secretKey = 'my-secret-key';

router.post('/authenticatePayment', async (req, res) => {
  // Simulate payment processing logic
  const { cardHolderFirstname, cardHolderSurname, cardNumber, cardType, cardExpiration } = req.body;

  // Perform necessary validation and processing
  if (cardHolderFirstname && cardHolderSurname && cardNumber && cardType && cardExpiration) {
    const payload = { cardHolderFirstname, cardHolderSurname, cardNumber, cardType, cardExpiration }
    const token = jwt.sign(payload, secretKey, { expiresIn: '1m' });

    // Payment successful
    res.status(200).json({
      message: 'Payment authentication successful',
      jwtPaymentToken: token
    });
  } else {
    // Payment failed
    res.status(400).json({ message: 'Payment authentication failed' });
  }
});

router.post('/payment', async (req, res) => {
  // Simulate payment processing logic
  const { paymentToken, amount } = req.body;

  try {
    // Payment successful
    const decoded = await jwt.verify(paymentToken, secretKey);
    console.log('Decoded token:', decoded);
    res.status(200).json({ message: 'Payment successful' });
  } catch (error) {
    // Payment failed
    console.error('Invalid token:', error.message);
    res.status(400).json({message: 'Payment failed'});
  }
});

module.exports = router;
