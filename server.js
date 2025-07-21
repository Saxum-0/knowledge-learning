require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models'); // ✅ On importe l'instance Sequelize correctement

// launch server HTTP
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Connexion and Synchronisation Sequelize
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connexion à la base de données réussie.');
    return sequelize.sync();
  })
  .then(() => {
    console.log('📦 Modèles synchronisés avec la base.');
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à la base de données :', err);
  });
