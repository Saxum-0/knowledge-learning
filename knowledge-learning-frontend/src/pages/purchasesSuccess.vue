<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import api from '@/utils/api'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const type = route.query.type
  const id = route.query.id

  if (!type || !id) return router.push('/purchases')

  try {
    if (type === 'lesson') {
      await api.post(`/buy/lesson/${id}`, null, { withCredentials: true })
    } else if (type === 'cursus') {
      await api.post(`/buy/cursus/${id}`, null, { withCredentials: true })
    }

    router.push('/purchases')
  } catch (err) {
    console.error('❌ Erreur achat :', err)
    alert("Erreur enregistrement de l'achat")
    router.push('/')
  }
})
</script>

<template>
  <p>Validation de l’achat en cours...</p>
</template>
