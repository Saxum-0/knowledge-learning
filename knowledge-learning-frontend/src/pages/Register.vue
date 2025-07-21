<template>
  <div class="register">
    <h1>Créer un compte</h1>

    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="fullName">Nom complet :</label>
        <input type="text" id="fullName" v-model="fullName" required />
      </div>

      <div class="form-group">
        <label for="email">Email :</label>
        <input type="email" id="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe :</label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <button type="submit">S'inscrire</button>

      <p v-if="message" :class="{ success: success, error: !success }">{{ message }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api'
import { useRouter } from 'vue-router'

const fullName = ref('')
const email = ref('')
const password = ref('')
const message = ref('')
const success = ref(false)
const csrfToken = ref('')
const router = useRouter()

// Récupération du token CSRF au montage
onMounted(async () => {
  try {
    const res = await api.get('/security/csrf-token', {
      withCredentials: true
    })
    csrfToken.value = res.data.csrfToken
  } catch (err) {
    console.error('Erreur récupération CSRF token', err)
  }
})
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]).{8,}$/;


const handleRegister = async () => {
  // Vérification avant l'envoi
  if (!passwordRegex.test(password.value)) {
    message.value = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.'
    success.value = false
    return
  }

  try {
    await api.post(
      '/auth/register',
      {
        fullName: fullName.value,
        email: email.value,
        password: password.value
      },
      {
        withCredentials: true,
        headers: {
          'X-CSRF-Token': csrfToken.value
        }
      }
    )

    message.value = 'Inscription réussie ! Vérifie tes mails pour activer ton compte.'
    success.value = true
    fullName.value = email.value = password.value = ''
    setTimeout(() => router.push('/login'), 2000)
    window.dispatchEvent(new Event('user-updated'))
  } catch (err) {
    console.error(err)
    message.value = err.response?.data?.message || 'Erreur lors de l’inscription.'
    success.value = false
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
