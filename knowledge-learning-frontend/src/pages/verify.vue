<template>
  <div class="verify-container">
    <h2 v-if="success">✅ Compte activé avec succès !</h2>
    <h2 v-else-if="error">❌ Lien invalide ou expiré.</h2>
    <h2 v-else>⏳ Activation de votre compte...</h2>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/utils/api'

const route = useRoute()
const router = useRouter()
const token = route.params.token
const success = ref(false)
const error = ref(false)

onMounted(async () => {
  try {
    const res = await api.get(`/auth/verify/${token}`)
    console.log('✅ Vérification réussie :', res.data)
    success.value = true

    // ✅ Ajoute cette partie ici
    setTimeout(() => {
      router.push('/login') // Redirige vers la page de connexion après 2.5s
    }, 2500)

  } catch (err) {
    console.error('❌ Erreur vérification :', err)
    error.value = true
  }
})

</script>

<style scoped>
.verify-container {
  text-align: center;
  padding: 3rem;
  font-size: 1.3rem;
  color: #00497c;
}
</style>
