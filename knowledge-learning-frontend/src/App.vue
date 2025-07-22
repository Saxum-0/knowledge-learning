<template>
  <div id="app">
    <nav class="navbar" v-if="!isLoading">
      <router-link to="/"><img src="/logo.png" alt="logo" /></router-link>
      <router-link v-if="!user" to="/login">Connexion</router-link>
      <router-link v-if="!user" to="/register">Inscription</router-link>
      <router-link v-if="user" to="/dashboard">Dashboard</router-link>
      <router-link v-if="user" to="/themes">Thèmes</router-link>
      <router-link v-if="user" to="/certifications">Certifications</router-link>
      <router-link v-if="user?.role === 'admin'" to="/admin">Admin</router-link>
      <button v-if="user" @click="logout">Se déconnecter</button>
    </nav>

    <main>
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

const fetchUser = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/auth/me', { withCredentials: true })
    user.value = res.data
    console.log('👤 Utilisateur récupéré :', res.data)
  } catch (err) {
    console.warn('⚠️ Erreur fetchUser :', err)
    user.value = null
  } finally {
    isLoading.value = false
  }
}

// fetch user and toast
onMounted(() => {
  console.log('📦 Cookies :', document.cookie);

  fetchUser().finally(() => {
    isLoading.value = false;
  });

  window.addEventListener('user-updated', async () => {
    try {
      await fetchUser();
      if (user.value) {
        alert(`👋 Bienvenue, ${user.value.fullName}`);
      }
    } catch (err) {
      console.warn("⚠️ Erreur lors de la mise à jour de l'utilisateur");
    }
  });
});


// 🔁 Met à jour l’utilisateur à chaque changement de route
watch(() => route.fullPath, () => {
  if (document.cookie.includes('token')) {
    fetchUser()
  }
})

const logout = async () => {
  try {
    await api.post('/auth/logout', null, { withCredentials: true })
    user.value = null
    router.push('/')
  } catch (err) {
    console.error('Erreur logout', err)
  }
}

// 🔔 Réagit à l’événement custom "user-updated" après login/register
onMounted(() => {
  window.addEventListener('user-updated', async () => {
    try {
      const res = await api.get('/user/me', { withCredentials: true })
      user.value = res.data
      console.log('👤 Utilisateur mis à jour après login :', res.data)
    } catch (err) {
      user.value = null
      console.warn('⚠️ Erreur mise à jour utilisateur après login')
    }
  })
})
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
  display: flex;
  align-items: center;
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
  width: auto;
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
