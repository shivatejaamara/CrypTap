const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');

// Load env variables
const API_KEY = process.env.TRANSAK_API_KEY;
const API_SECRET = process.env.TRANSAK_API_SECRET;

// Endpoint: POST /api/offramp
router.post('/', async (req, res) => {
  try {
    const { amount, upiId, walletAddress } = req.body;

    // Check required fields
    if (!amount || !upiId || !walletAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Step 1: Prepare request body
    const payload = {
      fiatAmount: amount,
      userData: {
        firstName: "Varun",
        lastName: "Test",
        fiatCurrency: "INR",
        address: {
          addressLine1: "123 Demo Street",
          city: "Hyderabad",
          state: "TS",
          country: "IN",
          pincode: "500001"
        },
        contactDetails: {
          email: "user@example.com",
          phoneNumber: "+919999999999"
        },
        paymentDetails: {
          upi: upiId
        }
      },
      cryptoCurrency: "MATIC",
      cryptoNetwork: "polygon",
      walletAddress,
    };

    // Step 2: Generate HMAC Signature
    const signature = crypto
      .createHmac('sha256', API_SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');

    // Step 3: Make API call to Transak
    const response = await axios.post(
      'https://stg-api.transak.com/api/v2/offramp',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY,
          'signature': signature,
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('❌ Transak Offramp error:', error?.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to create Offramp transaction' });
  }
});

module.exports = router;
