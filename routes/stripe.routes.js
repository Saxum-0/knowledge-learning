const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  console.log("📦 Données reçues:", req.body);
  const { amount, cursusId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Achat cursus #${cursusId || 'n/a'}`,
          },
          unit_amount: Math.round(parseFloat(amount) * 100),
        },
        quantity: 1,
      }],
      success_url: `${process.env.BACK_URL}/stripe/success?cursusId=${cursusId}`,
      cancel_url: `${process.env.BACK_URL}/stripe/cancel`,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('❌ Erreur Stripe :', err);
    res.status(500).json({ error: 'Erreur création session Stripe' });
  }
});

module.exports = router;
