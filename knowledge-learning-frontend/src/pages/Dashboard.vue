<template>
  <div>
    <h1>Bienvenue sur votre tableau de bord</h1>
    <p>Vous pouvez accéder à vos leçons, cursus, certifications et effectuer des achats.</p>

    <ul>
      <li><router-link to="/themes">Explorer les thèmes</router-link></li>
      <li><router-link to="/certifications">Mes certifications</router-link></li>
      <li><router-link to="/purchases">Mes achats</router-link></li>
      <li v-if="isAdmin"><router-link to="/admin">Espace administrateur</router-link></li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api'

const isAdmin = ref(false)

onMounted(async () => {
  try {
    const res = await api.get('/user/me', {
      withCredentials: true
    })
    isAdmin.value = res.data.role === 'admin'
  } catch (err) {
    console.error('Erreur récupération infos utilisateur', err)
  }
})
</script>
<style scoped>
h1 {
  font-family: 'Comic Sans MS', cursive, sans-serif;
  font-size: 2.2rem;
  color: #00497c;
  margin-bottom: 0.5rem;
}

p {
  font-size: 1.1rem;
  color: #384050;
  margin-bottom: 1.5rem;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 1rem;
}

a {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background-color: #0074c7;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

a:hover {
  background-color: #005fa3;
}

</style>
