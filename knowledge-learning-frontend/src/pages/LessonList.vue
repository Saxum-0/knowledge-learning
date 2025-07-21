<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/api'
import StripeLessonButton from '@/components/StripeLessonButton.vue'




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
    });

    const csrfToken = csrfRes.data.csrfToken;

    await api.post(`/buy/lesson/${id}`, {}, {
      headers: {
        'X-CSRF-Token': csrfToken
      },
      withCredentials: true
    });

    alert('✅ Leçon achetée');
  } catch (err) {
    console.error('Erreur achat leçon', err);
    alert('❌ Erreur achat : ' + err.response?.status);
  }
}

</script>

<template>
  <div>
    <h2>Leçons du cursus</h2>
    <ul v-if="lessons.length">
      <li v-for="lesson in lessons" :key="lesson.id">
        {{ lesson.title }} – {{ lesson.price }} €
        <StripeLessonButton :lesson-id="lesson.id" :amount="lesson.price.toString()" />
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
