<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/"><img src="/logo.png" alt="logo" /></router-link>

      <div class="nav-links">
        <router-link v-if="!user" to="/login">Connexion</router-link>
        <router-link v-if="!user" to="/register">Inscription</router-link>

        <router-link v-if="user" to="/dashboard">Dashboard</router-link>
        <router-link v-if="user" to="/themes">Thèmes</router-link>
        <router-link v-if="user" to="/certifications">Certifications</router-link>
        <router-link v-if="user?.role === 'admin'" to="/admin">Admin</router-link>

        <button v-if="user" @click="logout">Se déconnecter</button>
      </div>
    </nav>

    <main v-if="!isLoading">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/utils/api'

const router = useRouter()
const route = useRoute()
const user = ref(null)
const isLoading = ref(true)

// Fonction pour récupérer l'utilisateur
const fetchUser = async () => {
  try {
    const res = await api.get('/auth/me', { withCredentials: true })
    user.value = res.data
    console.log('👤 Utilisateur récupéré :', user.value)
  } catch (err) {
    console.warn('⚠️ Erreur fetchUser :', err.message)
    user.value = null
  } finally {
    isLoading.value = false
  }
}

// Au montage : récupérer user + écouter user-updated
onMounted(() => {
  console.log('📦 Cookies :', document.cookie)
  fetchUser()

  window.addEventListener('user-updated', async () => {
    await fetchUser()
    if (user.value) {
      alert(`👋 Bienvenue, ${user.value.fullName}`)
    }
  })
})

// Changement de route → re-fetch user si token présent
watch(() => route.fullPath, () => {
  if (document.cookie.includes('token')) {
    fetchUser()
  }
})

// Déconnexion
const logout = async () => {
  try {
    await api.post('/auth/logout', null, { withCredentials: true })
    user.value = null
    router.push('/')
  } catch (err) {
    console.error('❌ Erreur logout :', err.message)
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color: #00497c;
  padding: 1rem 2rem;
  font-family: 'Comic Sans MS', cursive, sans-serif;
}

.navbar a {
  color: white;
  text-decoration: none;
  margin-left: 1rem;
  font-weight: 500;
  font-size: 1rem;
  transition: opacity 0.3s;
}

.navbar a:hover {
  opacity: 0.8;
}

.navbar a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}

.navbar img {
  height: 40px;
  margin-right: 0.5rem;
}

.navbar button {
  background-color: #cd2c2e;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.navbar button:hover {
  background-color: #b12628;
}

main {
  padding: 1.5rem;
}
</style>
