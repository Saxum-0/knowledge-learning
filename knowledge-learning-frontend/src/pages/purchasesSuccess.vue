<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import api from '@/utils/api'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const type = route.query.type
  const id = route.query.id

  console.log("📦 Query params récupérés :", route.query)

  if (!type || !id) {
    console.warn("❌ Type ou ID manquant dans l'URL")
    return router.push('/purchases')
  }

  try {
    if (type === 'lesson') {
      console.log(`🛒 Enregistrement de l'achat de la leçon ID=${id}`)
      const res = await api.post(`/buy/lesson/${id}`, null, { withCredentials: true })
      console.log("✅ Achat leçon enregistré :", res.data)
    } else if (type === 'cursus') {
      console.log(`🛒 Enregistrement de l'achat du cursus ID=${id}`)
      const res = await api.post(`/buy/cursus/${id}`, null, { withCredentials: true })
      console.log("✅ Achat cursus enregistré :", res.data)
    } else {
      console.warn("❌ Type inconnu :", type)
      return router.push('/')
    }

    alert("✅ Achat confirmé. Redirection vers vos achats...")
    await router.push('/purchases')

  } catch (err) {
    console.error('❌ Erreur enregistrement achat :', err)
    alert("❌ Erreur lors de l'enregistrement de l'achat")
    router.push('/')
  }
})
</script>

<template>
  <p>Achat validé ✅ Vous allez être redirigé vers vos leçons...</p>
</template>

