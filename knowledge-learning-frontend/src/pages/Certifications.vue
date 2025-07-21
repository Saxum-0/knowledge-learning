<template>
  <div>
    <h2>Mes certifications</h2>

<ul v-if="certifications.length">
  <li v-for="certif in certifications" :key="certif.id">
  ✅ Certification – 
  {{ certif.cursus?.title || 'Titre manquant' }} – 
  {{ certif.user?.fullName || 'Utilisateur inconnu' }}  
  <br />
  Obtenue le : {{ formatDate(certif.obtainedAt) }}
</li>
</ul>


    <p v-else>Vous n’avez pas encore obtenu de certification.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api'

const certifications = ref([])

onMounted(async () => {
  try {
    const res = await api.get('/certifications/my-certifications', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    certifications.value = res.data || []
  } catch (error) {
    console.error('Erreur récupération certifications', error)
  }
})
function formatDate(dateStr) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  return new Date(dateStr).toLocaleDateString('fr-FR', options)
}

</script>

<style scoped>
h2 {
  font-family: 'Comic Sans MS', cursive, sans-serif;
  font-size: 2rem;
  color: #00497c;
  margin-bottom: 1rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  background-color: #f1f8fc;
  border: 1px solid #0074c7;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #384050;
  font-family: 'Comic Sans MS', cursive, sans-serif;
}

p {
  font-size: 1.1rem;
  color: #384050;
  font-style: italic;
}
</style>
