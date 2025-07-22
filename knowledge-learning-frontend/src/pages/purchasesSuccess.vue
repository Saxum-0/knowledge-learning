<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import api from '@/utils/api'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const { type, id } = route.query

  if (!type || !id) {
    console.warn("❌ Paramètres manquants")
    return router.push('/purchases')
  }

  try {
    if (type === 'lesson') {
      await api.post(`/buy/lesson/${id}`, null, { withCredentials: true })
    } else if (type === 'cursus') {
      await api.post(`/buy/cursus/${id}`, null, { withCredentials: true })
    } else {
      console.warn("❌ Type inconnu :", type)
      return router.push('/')
    }

    console.log("✅ Achat enregistré :", type, id)
    router.push('/purchases')
  } catch (err) {
    console.error('❌ Erreur enregistrement achat :', err)
    alert("Erreur pendant l’enregistrement de l’achat.")
    router.push('/')
  }
})
</script>

<template>
  <p>✅ Traitement de votre achat en cours...</p>
</template>
