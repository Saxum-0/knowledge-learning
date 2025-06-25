<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/api'

const lessons = ref([])
const message = ref('')
const route = useRoute()

onMounted(async () => {
  try {
    const res = await api.get(`/public/cursus/${route.params.id}/lessons`)
    lessons.value = res.data
  } catch (err) {
    console.error('Erreur récupération des leçons', err)
  }
})

const buy = async (id) => {
  try {
    const csrfRes = await api.get('/security/csrf-token', {
      withCredentials: true
    })
    const csrfToken = csrfRes.data.csrfToken

    await api.post(`/buy/lesson/${id}`, {}, {
      headers: {
        'X-CSRF-Token': csrfToken
      },
      withCredentials: true
    })

    message.value = '✅ Leçon achetée avec succès !'
  } catch (err) {
    console.error('Erreur achat leçon', err)

    if (err.response?.status === 409) {
      message.value = '⚠️ Cette leçon est déjà achetée.'
    } else if (err.response?.status === 403) {
      message.value = '⛔ Problème de sécurité CSRF ou session. Rafraîchis la page.'
    } else {
      message.value = '❌ Erreur lors de l’achat.'
    }
  }
}
</script>

<template>
  <div>
    <h2>Leçons du cursus</h2>
    <ul v-if="lessons.length">
      <li v-for="lesson in lessons" :key="lesson.id">
        {{ lesson.title }} – {{ lesson.price }} €
        <button @click="buy(lesson.id)">Acheter</button>
      </li>
    </ul>
    <p v-else>Aucune leçon trouvée.</p>
    <p v-if="message" class="feedback">{{ message }}</p>
  </div>
</template>



<style scoped>
div {
  background-color: #f1f8fc;
  padding: 2rem;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  color: #384050;
  border-radius: 8px;
}

h2 {
  color: #00497c;
  margin-bottom: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background-color: white;
  border: 1px solid #ccc;
  border-left: 5px solid #0074c7;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  background: #cd2c2e;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
}

button:hover {
  background: #a02224;
}

.feedback {
  margin-top: 1rem;
  font-weight: bold;
  color: #82b864;
}
</style>
