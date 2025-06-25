<template>
  <div class="verify">
    <h1>Activation de compte</h1>

    <p v-if="loading">⏳ Vérification en cours...</p>
    <p v-else-if="success" class="success">✅ Votre compte a été activé avec succès.</p>
    <p v-else class="error">❌ Le lien est invalide ou a expiré.</p>

    <router-link v-if="!loading" to="/login">Se connecter</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/api'

const route = useRoute()
const success = ref(false)
const loading = ref(true)

onMounted(async () => {
  try {
    const token = route.params.token
    await api.get(`/auth/verify/${token}`)
    success.value = true
  } catch (err) {
    console.error('Erreur vérification :', err)
    success.value = false
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.verify {
  max-width: 500px;
  margin: 4rem auto;
  padding: 2rem;
  background-color: #f1f8fc;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: #00497c;
}

h1 {
  color: #00497c;
  margin-bottom: 1.5rem;
}

.success {
  color: #82b864;
  font-weight: bold;
  margin: 1rem 0;
}

.error {
  color: #cd2c2e;
  font-weight: bold;
  margin: 1rem 0;
}

a {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  background-color: #0074c7;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s;
}

a:hover {
  background-color: #005fa3;
}
</style>

