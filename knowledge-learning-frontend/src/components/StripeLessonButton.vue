<script setup>
import { loadStripe } from '@stripe/stripe-js'
import api from '@/utils/api'

const props = defineProps({
  lessonId: Number,
  amount: Number // en euros (ex: 10)
})

const checkout = async () => {
  try {
    const csrfRes = await api.get('/security/csrf-token', { withCredentials: true })
    const csrfToken = csrfRes.data.csrfToken

    const res = await api.post('/stripe/create-checkout-session', {
      lessonId: props.lessonId,
      amount: props.amount
    }, {
      headers: { 'X-CSRF-Token': csrfToken },
      withCredentials: true
    })

    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
    await stripe.redirectToCheckout({ sessionId: res.data.id })

  } catch (err) {
    console.error('Erreur Stripe:', err)
    alert('❌ Paiement échoué.')
  }
}
</script>

<template>
  <button @click="checkout">Payer avec Stripe</button>
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
