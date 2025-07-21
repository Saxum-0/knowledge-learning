const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const { amount, successUrl, cancelUrl } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Achat leçon ou cursus',
          },
          unit_amount: Math.round(parseFloat(amount) * 100),
        },
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('Erreur Stripe :', err);
    res.status(500).json({ error: 'Erreur création session Stripe' });
  }
});

module.exports = router;
