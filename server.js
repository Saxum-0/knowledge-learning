require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.SQLITE_STORAGE || './dev.db', // on changera ça sur Render
  logging: false
});

// 🔁 Charge les associations entre les modèles
require('./models'); // ← très important !

// 🌍 Lancement du serveur HTTP
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// 🔄 Connexion + Synchronisation Sequelize
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
