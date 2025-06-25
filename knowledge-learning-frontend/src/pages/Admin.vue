<template>
  <div class="admin">
    <h1>🛠️ Interface d'administration</h1>

    <!-- THEMES -->
    <section>
      <h2>🎨 Thèmes</h2>
      <ul>
        <li v-for="t in themes" :key="t.id">
          {{ t.name }}
          <button @click="deleteItem('themes', t.id)">❌ Supprimer</button>
        </li>
      </ul>
      <form @submit.prevent="createItem('themes', { name: newTheme })">
        <input v-model="newTheme" placeholder="Nouveau thème" required />
        <button type="submit">➕ Ajouter</button>
      </form>
      <form @submit.prevent="updateItem('themes', editTheme.id, { name: editTheme.name })">
        <input v-model="editTheme.id" placeholder="ID" required />
        <input v-model="editTheme.name" placeholder="Nom modifié" required />
        <button type="submit">✏️ Modifier</button>
      </form>
    </section>

    <!-- CURSUS -->
    <section>
      <h2>📚 Cursus</h2>
      <ul>
        <li v-for="c in cursus" :key="c.id">
          {{ c.title }} – {{ c.price }} €
          <button @click="deleteItem('cursus', c.id)">❌ Supprimer</button>
        </li>
      </ul>
      <form @submit.prevent="createItem('cursus', { title: newCursus.title, price: newCursus.price, ThemeId: newCursus.ThemeId })">
        <input v-model="newCursus.title" placeholder="Titre" required />
        <input v-model.number="newCursus.price" placeholder="Prix" required type="number" />
        <select v-model.number="newCursus.ThemeId" required>
          <option disabled value="">-- Sélectionner un thème --</option>
          <option v-for="t in themes" :key="t.id" :value="t.id">{{ t.name }}</option>
        </select>
        <button type="submit">➕ Ajouter</button>
      </form>
      <form @submit.prevent="updateItem('cursus', editCursus.id, { title: editCursus.title, price: editCursus.price, ThemeId: editCursus.ThemeId })">
        <input v-model="editCursus.id" placeholder="ID" required />
        <input v-model="editCursus.title" placeholder="Nouveau titre" required />
        <input v-model.number="editCursus.price" placeholder="Nouveau prix" required type="number" />
        <select v-model.number="newCursus.ThemeId" required>
          <option disabled value="">-- Sélectionner un thème --</option>
          <option v-for="t in themes" :key="t.id" :value="t.id">{{ t.name }}</option>
        </select>
        <button type="submit">✏️ Modifier</button>
      </form>
    </section>

    <!-- LEÇONS -->
    <!-- LEÇONS -->
<section>
  <h2>📘 Leçons</h2>
  <ul>
    <li v-for="l in lessons" :key="l.id">
      {{ l.title }} – {{ l.price }} €
      <button @click="deleteItem('lesson', l.id)">❌ Supprimer</button>
    </li>
  </ul>

  <!-- Formulaire de création -->
  <form @submit.prevent="createItem('lesson', {
    title: newLesson.title,
    price: newLesson.price,
    description: newLesson.description,
    videoUrl: newLesson.videoUrl,
    CursusId: newLesson.CursusId
  })">
    <input v-model="newLesson.title" placeholder="Titre" required />
    <input v-model.number="newLesson.price" placeholder="Prix" required type="number" />
    <input v-model="newLesson.description" placeholder="Description" required />
    <input v-model="newLesson.videoUrl" placeholder="URL de la vidéo" required />
    <select v-model.number="newLesson.CursusId" required>
      <option disabled value="">-- Sélectionner un cursus --</option>
      <option v-for="c in cursus" :key="c.id" :value="c.id">{{ c.title }}</option>
    </select>
    <button type="submit">➕ Ajouter</button>
  </form>

  <!-- Formulaire de modification -->
  <form @submit.prevent="updateItem('lesson', editLesson.id, {
    title: editLesson.title,
    price: editLesson.price,
    description: editLesson.description,
    videoUrl: editLesson.videoUrl,
    CursusId: editLesson.CursusId
  })">
    <input v-model="editLesson.id" placeholder="ID" required />
    <input v-model="editLesson.title" placeholder="Nouveau titre" required />
    <input v-model.number="editLesson.price" placeholder="Nouveau prix" required type="number" />
    <input v-model="editLesson.description" placeholder="Description" required />
    <input v-model="editLesson.videoUrl" placeholder="URL de la vidéo" required />
    <select v-model.number="editLesson.CursusId" required>
      <option disabled value="">-- Sélectionner un cursus --</option>
      <option v-for="c in cursus" :key="c.id" :value="c.id">{{ c.title }}</option>
    </select>
    <button type="submit">✏️ Modifier</button>
  </form>
</section>


    <!-- UTILISATEURS -->
    <section>
  <h2>👥 Utilisateurs</h2>
  <ul>
    <li v-for="u in users" :key="u.id">
      {{ u.fullName }} – {{ u.email }} ({{ u.role }})
      <button @click="editUser(u)">✏️ Modifier</button>
      <button @click="deleteItem('users', u.id)">❌ Supprimer</button>
    </li>
  </ul>

  <h3>{{ editingUser.id ? 'Modifier un utilisateur' : 'Ajouter un utilisateur' }}</h3>
  <form @submit.prevent="submitUser" class="edit-form">
    <input v-model="editingUser.fullName" placeholder="Nom complet" required />
    <input v-model="editingUser.email" placeholder="Email" required />
    <input v-model="editingUser.password" type="password" placeholder="Mot de passe (laisser vide pour ne pas changer)" />
    <select v-model="editingUser.role">
      <option value="client">client</option>
      <option value="admin">admin</option>
    </select>
    <button type="submit">💾 {{ editingUser.id ? 'Mettre à jour' : 'Créer' }}</button>
    <button type="button" @click="resetUser">Annuler</button>
  </form>
</section>


    <!-- ACHATS -->
    <section>
      <h2>🛒 Achats</h2>
      <ul>
        <li v-for="p in purchases" :key="p.id">
          {{ p.User?.fullName }} a acheté
          <p v-if="p.cursus">{{ p.cursus.title }}</p>
          <span v-else-if="p.Lesson">{{ p.Lesson.title }}</span>
          <button @click="deleteItem('purchases', p.id)">❌ Supprimer</button>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const themes = ref([])
const cursus = ref([])
const lessons = ref([])
const users = ref([])
const purchases = ref([])

const newTheme = ref('')
const editTheme = ref({ id: '', name: '' })

const newCursus = ref({ title: '', price: 0, ThemeId: null })
const editCursus = ref({ id: '', title: '', price: 0, ThemeId: null })

const newLesson = ref({ title: '', price: 0, description: '', videoUrl: '', CursusId: null })
const editLesson = ref({ id: '', title: '', price: 0, description: '', videoUrl: '', CursusId: null })



onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/user/me', { withCredentials: true })
    if ((res.data.role || '').toLowerCase() !== 'admin') {
      router.push('/dashboard')
    } else {
      loadData()
    }
  } catch {
    router.push('/login')
  }
})

const loadData = async () => {
  try {
    const [t, c, l, u, p] = await Promise.all([
      axios.get('http://localhost:3000/admin/themes', { withCredentials: true }),
      axios.get('http://localhost:3000/admin/cursus', { withCredentials: true }),
      axios.get('http://localhost:3000/admin/lesson', { withCredentials: true }),
      axios.get('http://localhost:3000/admin/users', { withCredentials: true }),
      axios.get('http://localhost:3000/admin/purchases', { withCredentials: true })
    ])
    themes.value = t.data
    cursus.value = c.data
    lessons.value = l.data
    users.value = u.data
    purchases.value = p.data
  } catch (err) {
    console.error('❌ Erreur chargement admin:', err)
  }
}

const deleteItem = async (type, id) => {
  if (!confirm('Confirmer la suppression ?')) return
  try {
    await axios.delete(`http://localhost:3000/admin/${type}/${id}`, { withCredentials: true })
    await loadData()
  } catch (err) {
    console.error(`Erreur suppression ${type}:`, err)
  }
}

const createItem = async (type, data) => {
  try {
    await axios.post(`http://localhost:3000/admin/${type}`, data, { withCredentials: true })
    await loadData()
  } catch (err) {
    console.error(`Erreur création ${type}:`, err)
  }
}

const updateItem = async (type, id, data) => {
  try {
    await axios.put(`http://localhost:3000/admin/${type}/${id}`, data, { withCredentials: true })
    await loadData()
  } catch (err) {
    console.error(`Erreur mise à jour ${type}:`, err)
  }
}
const editingUser = ref({ fullName: '', email: '', password: '', role: 'client' });

const editUser = (u) => {
  editingUser.value = { ...u, password: '' }; // Ne jamais préremplir le mot de passe
};

const resetUser = () => {
  editingUser.value = { fullName: '', email: '', password: '', role: 'client' };
};

const submitUser = async () => {
  try {
    const payload = {
      fullName: editingUser.value.fullName,
      email: editingUser.value.email,
      role: editingUser.value.role
    };
    if (editingUser.value.password) {
      payload.password = editingUser.value.password;
    }

    if (editingUser.value.id) {
      // Modification
      await axios.put(`http://localhost:3000/admin/users/${editingUser.value.id}`, payload, { withCredentials: true });
    } else {
      // Création
      await axios.post(`http://localhost:3000/admin/users`, payload, { withCredentials: true });
    }

    await loadData();
    resetUser();
  } catch (err) {
    console.error('Erreur ajout/modification utilisateur:', err);
  }
};


</script>

<style scoped>
.admin {
  max-width: 1100px;
  margin: auto;
  padding: 2rem;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  background-color: #f1f8fc;
  color: #384050;
}

section {
  margin-bottom: 2.5rem;
  border-bottom: 2px solid #00497c;
  padding-bottom: 1.5rem;
}

h1, h2 {
  color: #00497c;
}

ul {
  list-style: none;
  padding-left: 0;
}

li {
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: 1px solid #cce4f7;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

button {
  border: none;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  border-radius: 6px;
  font-weight: bold;
}

button[type="submit"] {
  background-color: #82b864;
  color: white;
}

button[type="button"] {
  background-color: #ccc;
  color: #333;
}

button:hover {
  opacity: 0.9;
}

button:active {
  transform: scale(0.97);
}

li button {
  background-color: #cd2c2e;
  color: white;
  margin-left: 0.5rem;
}

form {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

input, select {
  padding: 0.4rem 0.7rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
  min-width: 120px;
}

.edit-form {
  margin-top: 1rem;
  background: #ffffff;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #d1e7f5;
}
</style>

