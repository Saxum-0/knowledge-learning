const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Celui-là peut rester

router.post('/create-checkout-session', async (req, res) => {
  console.log("📦 Données reçues:", req.body);

  const { amount, lessonId } = req.body;

  // ✅ URLs codées en dur pour débloquer Stripe
  const successUrl = `https://knowledge-learning.netlify.app/purchases`;
  const cancelUrl = `https://knowledge-learning.netlify.app/`;

  console.log("👉 successUrl:", successUrl);
  console.log("👉 cancelUrl:", cancelUrl);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Achat leçon #${lessonId || 'n/a'}`,
          },
          unit_amount: Math.round(parseFloat(amount) * 100),
        },
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    console.log("✅ Session Stripe créée :", session.id);
    res.json({ id: session.id });
  } catch (err) {
    console.error('❌ Erreur Stripe :', err.message);
    console.error(err); // stack complète
    res.status(500).json({ error: 'Erreur création session Stripe' });
  }
});

module.exports = router;
