<template>
  <div class="login">
    <h1>Connexion</h1>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email :</label>
        <input type="email" id="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe :</label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <button type="submit">Se connecter</button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api'
import { useRouter } from 'vue-router'
import { user } from '@/stores/user' // 👈 adapt if needed

const email = ref('')
const password = ref('')
const error = ref('')
const csrfToken = ref('')
const router = useRouter()

onMounted(async () => {
  try {
    const res = await api.get('/security/csrf-token')
    csrfToken.value = res.data.csrfToken
  } catch (err) {
    console.error('Erreur CSRF', err)
  }
})

const handleLogin = async () => {
  try {
    // 1. POST /auth/login
    await api.post('/auth/login', {
      email: email.value,
      password: password.value
    }, {
      withCredentials: true,
      headers: { 'X-CSRF-Token': csrfToken.value }
    })

    // 2. GET /user/me
    const res = await api.get('/user/me', { withCredentials: true })
    user.value = res.data

    // 3. Notify + redirect
    window.dispatchEvent(new Event('user-updated'))
    router.push('/dashboard')
  } catch (err) {
    error.value = 'Connexion échouée : vérifie tes identifiants ou ton activation.'
    console.error('Erreur login:', err)
  }
}
</script>


<style scoped>
/* Style commun pour login et register */
.login, .register {
  max-width: 450px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f1f8fc;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Comic Sans MS', cursive, sans-serif;
}

h1 {
  text-align: center;
  color: #00497c;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  color: #384050;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-family: inherit;
}

button {
  width: 100%;
  padding: 0.6rem;
  background-color: #82b864; /* bouton vert */
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #6ea44f;
}

.error {
  color: #cd2c2e; /* rouge bouton */
  margin-top: 1rem;
  font-weight: bold;
  text-align: center;
}

.success {
  color: #82b864;
  margin-top: 1rem;
  font-weight: bold;
  text-align: center;
}
</style>
