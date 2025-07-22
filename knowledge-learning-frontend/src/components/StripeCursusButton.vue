<script setup>
import { loadStripe } from '@stripe/stripe-js'
import api from '@/utils/api'

const props = defineProps({
  cursusId: Number,
  amount: Number // valeur en euros (ex: 49)
})

const checkout = async () => {
  try {
    const csrfRes = await api.get('/security/csrf-token', { withCredentials: true })
    const csrfToken = csrfRes.data.csrfToken

    // Crée la session Stripe côté back-end
    const res = await api.post('/stripe/create-checkout-session', {
      cursusId: props.cursusId,
      amount: props.amount
    }, {
      headers: { 'X-CSRF-Token': csrfToken },
      withCredentials: true
    })

    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
    await stripe.redirectToCheckout({ sessionId: res.data.id })


  } catch (err) {
    console.error('Erreur lors du paiement Stripe :', err)
    alert('❌ Paiement échoué')
  }
}
</script>

<template>
  <button @click="checkout">Payer avec Stripe</button>
</template>

<style scoped>
button {
  background: #6772e5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}
button:hover {
  background: #5469d4;
}
</style>
