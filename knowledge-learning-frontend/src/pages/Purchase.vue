<template>
  <div>
    <h2>🎓 Vos achats</h2>

    <section>
      <h3>📚 Cursus achetés</h3>
      <ul v-if="purchasedCursus.length">
  <li v-for="c in purchasedCursus" :key="c.id">
    {{ c.title }} –
    <button @click="toggleValidation('cursus', c.id)">
      {{ validatedCursus.includes(c.id) ? 'Annuler' : 'Valider' }}
    </button>
  </li>
</ul>


      <p v-else>Aucun cursus acheté.</p>
    </section>

    <section>
  <h3>📘 Leçons achetées</h3>
<ul v-if="purchasedLessons.length">
  <li v-for="l in purchasedLessons" :key="l.id">
    <h4>{{ l.title }}</h4>
    <p>{{ l.description }}</p>
    <iframe
  v-if="l.videoUrl"
  width="560"
  height="315"
  :src="`https://www.youtube.com/embed/${extractYoutubeId(l.videoUrl)}`"
  frameborder="0"
  allowfullscreen
></iframe>

    <button @click="toggleValidation('lesson', l.id)">
      {{ validatedLessons.includes(l.id) ? 'Annuler' : 'Valider' }}
    </button>
  </li>
</ul>
  <p v-else>Aucune leçon achetée.</p>
</section>


    <p v-if="message" class="feedback">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api'

const message = ref('')
const purchasedLessons = ref([])
const purchasedCursus = ref([])
const validatedLessons = ref([])
const validatedCursus = ref([])
const csrfToken = ref('')

onMounted(async () => {
  try {
    // 🔄 Charge les leçons, cursus et validations sans CSRF
    const [myLessonsRes, myCursusRes, validatedRes] = await Promise.all([
      api.get('/buy/my-lessons'),
      api.get('/buy/my-cursus'),
      api.get('/validate/my-validations')
    ])

    purchasedLessons.value = myLessonsRes.data || []
    purchasedCursus.value = myCursusRes.data || []
    validatedLessons.value = validatedRes.data.lessons || []
    validatedCursus.value = validatedRes.data.cursus || []

    // 🔐 Récupère le token CSRF uniquement pour les actions protégées
    const csrfRes = await api.get('/security/csrf-token')
    csrfToken.value = csrfRes.data.csrfToken

  } catch (err) {
    console.error('Erreur chargement', err)
    message.value = 'Erreur lors du chargement des contenus.'
  }
})

const toggleValidation = async (type, id) => {
  const isLesson = type === 'lesson'
  const list = isLesson ? validatedLessons : validatedCursus
  const url = `/validate-protected/${type}/${id}`
  const isValidated = list.value.includes(id)
  const method = isValidated ? 'delete' : 'post'
  const label = isLesson ? 'Leçon' : 'Cursus'

  try {
    await api({
      method,
      url,
      withCredentials: true,
      headers: {
        'X-CSRF-Token': csrfToken.value
      },
      data: {} // nécessaire même pour DELETE avec axios
    })

    message.value = `${label} ${isValidated ? 'dévalidé(e) ❌' : 'validé(e) avec succès ✅'}`

    if (isValidated) {
      list.value = list.value.filter(el => el !== id)
    } else {
      list.value.push(id)
    }

  } catch (err) {
    console.error(`Erreur lors de la ${isValidated ? 'dévalidation' : 'validation'}`, err)
    message.value = `Erreur lors de la ${isValidated ? 'dévalidation' : 'validation'} du ${label.toLowerCase()}.`
  }
}

const extractYoutubeId = (url) => {
  const match = url.match(/(?:v=|be\/)([^&]+)/);
  return match ? match[1] : '';
};

</script>

<style scoped>
h2 {
  text-align: center;
  color: #00497c;
  margin-bottom: 1.5rem;
}

section {
  margin-bottom: 2rem;
  background-color: #f1f8fc;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

h3 {
  color: #0074c7;
  margin-bottom: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background-color: white;
  border: 1px solid #cdd9e3;
  border-radius: 6px;
  margin-bottom: 1rem;
  padding: 1rem;
}

h4 {
  margin: 0.5rem 0;
  color: #00497c;
}

p {
  margin: 0.5rem 0;
  color: #384050;
}

button {
  margin-top: 0.5rem;
  padding: 0.4rem 0.8rem;
  background-color: #82b864; /* bouton vert */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}
button:hover {
  background-color: #6ea44f;
}

.feedback {
  text-align: center;
  margin-top: 1rem;
  font-weight: bold;
  color: green;
}

iframe {
  width: 100%;
  height: 315px;
  margin-top: 0.5rem;
  border-radius: 6px;
  border: none;
}
</style>
