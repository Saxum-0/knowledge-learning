const request = require('supertest');
const sequelize = require('../config/db');
const app = require('../app');
const bcrypt = require('bcrypt');
const { User, Theme, Cursus, Lesson } = require('../models');

const agent = request.agent(app); // ✅ agent conserve les cookies automatiquement
const anon = request(app);        // Agent anonyme pour tests non connectés

let csrfToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Création d'un utilisateur actif
  await User.create({
    fullName: 'Testeur',
    email: 'test@example.com',
    password: await bcrypt.hash('Azerty123', 10),
    role: 'client',
    isActive: true
  });

  const theme = await Theme.create({ name: 'Test Thème' });

  const cursus = await Cursus.create({
    title: 'Test Cursus',
    price: 50,
    ThemeId: theme.id
  });

  await Lesson.create({
    title: 'Test Leçon',
    price: 10,
    description: 'Une leçon test',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    CursusId: cursus.id
  });

  // ⚠️ Récupération du token CSRF avec l'agent connecté
  const csrfRes = await agent.get('/security/csrf-token');
  csrfToken = csrfRes.body.csrfToken;

  // Connexion (le cookie est conservé dans agent)
  await agent
    .post('/auth/login')
    .set('X-CSRF-Token', csrfToken)
    .send({
      email: 'test@example.com',
      password: 'Azerty123'
    });
});

describe('✅ Authentification', () => {
  test('Connexion réussie', async () => {
    const res = await agent
      .post('/auth/login')
      .set('X-CSRF-Token', csrfToken)
      .send({
        email: 'test@example.com',
        password: 'Azerty123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined(); // ✅ Cookie JWT attendu
  });

  test('Connexion échouée avec mauvais mot de passe', async () => {
    const res = await anon
      .post('/auth/login')
      .set('X-CSRF-Token', csrfToken)
      .send({
        email: 'test@example.com',
        password: 'WrongPass'
      });

    expect(res.statusCode).toBe(401);
  });
});

describe('🎓 Accès public', () => {
  test('GET /public/themes', async () => {
    const res = await anon.get('/public/themes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('💳 Achats', () => {
  test('Achat de cursus refusé sans token', async () => {
    const res = await anon
      .post('/buy/cursus/1')
      .set('X-CSRF-Token', csrfToken);

    expect(res.statusCode).toBe(401);
  });

  test('Achat de cursus accepté', async () => {
    const res = await agent
      .post('/buy/cursus/1')
      .set('X-CSRF-Token', csrfToken);

    expect([200, 201]).toContain(res.statusCode);
  });

  test('Achat de leçon accepté', async () => {
    const res = await agent
      .post('/buy/lesson/1')
      .set('X-CSRF-Token', csrfToken);

    expect([200, 201]).toContain(res.statusCode);
  });
});

describe('📘 Leçons achetées', () => {
  test('Récupération des leçons achetées', async () => {
    const res = await agent
      .get('/buy/my-lessons')
      .set('X-CSRF-Token', csrfToken);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('📚 Cursus achetés', () => {
  test('Récupération des cursus achetés', async () => {
    const res = await agent
      .get('/buy/my-cursus')
      .set('X-CSRF-Token', csrfToken);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
