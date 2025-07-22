<script setup>
import { loadStripe } from '@stripe/stripe-js'
import api from '@/utils/api'

const props = defineProps({
  lessonId: Number,
  amount: Number // en euros (ex: 10)
})

const checkout = async () => {
  try {
    // 🔐 Récupère le token CSRF
    const csrfRes = await api.get('/security/csrf-token', { withCredentials: true })
    const csrfToken = csrfRes.data.csrfToken

    // 🧾 Crée la session Stripe côté serveur
    const res = await api.post('/stripe/create-checkout-session', {
      lessonId: props.lessonId,
      amount: props.amount
    }, {
      headers: { 'X-CSRF-Token': csrfToken },
      withCredentials: true
    })

    const sessionId = res?.data?.id
    console.log("👉 sessionId reçu :", sessionId)

    if (!sessionId || typeof sessionId !== 'string') {
      throw new Error("❌ sessionId invalide ou manquant")
    }

    // 🚀 Redirection vers Stripe
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
    const { error } = await stripe.redirectToCheckout({ sessionId })

    if (error) {
      console.error("❌ Erreur redirectToCheckout :", error.message)
      alert("Redirection Stripe échouée : " + error.message)
    }

  } catch (err) {
    console.error('❌ Erreur Stripe :', err)
    alert('❌ Paiement échoué.')
  }
}
</script>

<template>
  <button @click="checkout">Acheter</button>
</template>

<style scoped>
button {
  background-color: #6772e5;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #5469d4;
}
</style>
