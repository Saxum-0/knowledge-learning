<template>
  <div>
    <h1>Thèmes de formation</h1>

    <ul v-if="themes.length">
      <li v-for="theme in themes" :key="theme.id">
        <router-link :to="`/themes/${theme.id}/cursus`">
          {{ theme.name }}
        </router-link>
      </li>
    </ul>

    <p v-else>Chargement des thèmes...</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '@/utils/api'

const themes = ref([])

onMounted(async () => {
  try {
    const res = await api.get('/public/themes', {
      withCredentials: true
    })
    themes.value = res.data
  } catch (err) {
    console.error('Erreur lors du chargement des thèmes', err)
  }
})
</script>
<style scoped>
h1 {
  text-align: center;
  color: #00497c;
  margin-bottom: 2rem;
}

ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  list-style: none;
  padding: 0;
  gap: 1rem;
}

li {
  background-color: #f1f8fc;
  padding: 1rem 2rem;
  border: 1px solid #cfdbe6;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s, transform 0.2s;
}

li:hover {
  background-color: #e0f0fb;
  transform: translateY(-2px);
}

a {
  color: #0074c7;
  font-weight: bold;
  text-decoration: none;
  font-size: 1.1rem;
}

a:hover {
  text-decoration: underline;
}

p {
  text-align: center;
  color: #384050;
}
</style>
