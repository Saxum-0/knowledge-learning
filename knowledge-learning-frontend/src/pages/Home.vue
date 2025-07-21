<template>
  <div class="home">
    <h1>🎓 Bienvenue sur <span class="brand">Knowledge Learning</span></h1>

    <p class="intro">
      La plateforme de formation qui vous permet d'apprendre à votre rythme. Achetez des leçons ou des cursus complets,
      suivez vos progrès, validez vos acquis, et obtenez des certifications 📜.
    </p>

    <div class="actions">
      <router-link to="/themes" class="btn primary">Explorer les formations</router-link>
      <router-link to="/register" class="btn">Créer un compte</router-link>
      <router-link to="/login" class="btn">Se connecter</router-link>
    </div>

    <div class="video-section">
      <h2>🎥 Découvrez le fonctionnement en vidéo</h2>
      <iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/JXFbRkmFn4s?list=PLi9e6Kz68NIJVK3inacHlbQYPb0_ofN01" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen>
</iframe>

    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 900px;
  margin: 3rem auto;
  text-align: center;
  padding: 2rem;
  background-color: #f1f8fc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 116, 199, 0.1);
}

.brand {
  color: #0074c7;
}

.intro {
  font-size: 1.2rem;
  margin: 1.5rem 0;
  color: #384050;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn {
  background-color: #00497c;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.btn.primary {
  background-color: #82b864;
}

.btn:hover {
  opacity: 0.9;
}

.video-section {
  margin-top: 3rem;
}

iframe {
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
}
</style>
<script>
const extractYoutubeId = (url) => {
  const match = url.match(/(?:v=|be\/)([^&]+)/);
  return match ? match[1] : '';
};
</script>