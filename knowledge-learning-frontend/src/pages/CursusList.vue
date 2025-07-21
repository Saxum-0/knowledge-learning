<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/api'
import StripeCursusButton from '@/components/StripeCursusButton.vue'



const route = useRoute()
const cursus = ref([])
const message = ref('')

onMounted(async () => {
  try {
    const res = await api.get(`/public/themes/${route.params.id}/cursus`, {
    })
    cursus.value = res.data
  } catch (error) {
    console.error('Erreur récupération des cursus :', error)
  }
})

const buy = async (id) => {
  try {
    const csrfRes = await api.get('/security/csrf-token', {
      withCredentials: true
    })
    const csrfToken = csrfRes.data.csrfToken

    await api.post(`/buy/cursus/${id}`, {}, {
      withCredentials: true,
      headers: { 'X-CSRF-Token': csrfToken }
    })

    message.value = 'Cursus acheté avec succès !'
  } catch (err) {
    console.error('Erreur achat cursus', err)
    message.value = 'Erreur lors de l’achat.'
  }
}
</script>

<template>
  <div>
    <h2>Cursus disponibles</h2>
    <ul v-if="cursus.length">
      <li v-for="c in cursus" :key="c.id">
        <router-link :to="`/cursus/${c.id}/lessons`">
          {{ c.title }} – {{ c.price }} €
        </router-link>
        <StripeCursusButton :cursus-id="c.id" :amount="c.price.toString()" />
      </li>
    </ul>
    <p v-else>Aucun cursus trouvé.</p>
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

router-link {
  color: #00497c;
  font-weight: bold;
  text-decoration: none;
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

