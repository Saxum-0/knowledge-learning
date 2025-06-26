<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/"><img src="/logo.png" alt="logo"></router-link>
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

const fetchUser = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    user.value = null
    return
  }

  try {
    const res = await api.get('/user/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    user.value = res.data
  } catch (err) {
    console.warn('⚠️ Erreur fetchUser :', err)
    // 🔴 Force la déconnexion locale
    localStorage.removeItem('token')
    user.value = null
  }
}







onMounted(fetchUser)

// reload user at every page
watch(() => route.fullPath, () => {
  fetchUser()
})

// 🔁 Logout
const logout = async () => {
  try {
    await api.post('/auth/logout', {}, {
      withCredentials: true
    })
    user.value = null
    router.push('/')
  } catch (err) {
    console.error('Erreur logout', err)
  }
}

// 🔁 update user for navbar ( login/register)
window.addEventListener('user-updated', fetchUser)
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
