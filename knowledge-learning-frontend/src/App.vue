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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const user = ref(null)

const fetchUser = async () => {
  try {
    const res = await axios.get('http://localhost:3000/user/me', {
      withCredentials: true
    })
    user.value = res.data
  } catch (err) {
    user.value = null
  }
}

// 🔁 Recharge l'utilisateur au chargement de l'app
onMounted(fetchUser)

const logout = async () => {
  try {
    await axios.post('http://localhost:3000/auth/logout', {}, {
      withCredentials: true
    })
    user.value = null
    router.push('/')
  } catch (err) {
    console.error('Erreur logout', err)
  }
}

// Écoute les changements manuels après login/register
window.addEventListener('user-updated', fetchUser)
</script>


<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color: #00497c; /* bleu foncé */
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

/* Boutons dans la navbar */
.navbar button {
  background-color: #cd2c2e; /* rouge */
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

/* Padding général du contenu principal */
main {
  padding: 1.5rem;
}
</style>
