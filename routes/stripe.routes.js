const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  console.log("📦 Données reçues:", req.body);

  const { amount, lessonId, cursusId } = req.body;

  const type = lessonId ? 'lesson' : 'cursus';
  const id = lessonId || cursusId;

  if (!id) {
    return res.status(400).json({ error: '❌ Aucune ID fournie (lessonId ou cursusId requis)' });
  }

  const successUrl = `https://knowledge-learning.netlify.app/purchases-success?type=${type}&id=${id}`;
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
            name: `Achat ${type} #${id}`,
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
    console.error(err);
    res.status(500).json({ error: 'Erreur création session Stripe' });
  }
});

module.exports = router;
