const request = require('supertest');
const sequelize = require('../config/db');
const app = require('../app');
const bcrypt = require('bcrypt');
const { User, Theme, Cursus, Lesson } = require('../models');

const agent = request.agent(app);
let csrfToken;
let jwtToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Création d’un utilisateur activé
  await User.create({
    fullName: 'Testeur',
    email: 'test@example.com',
    password: await bcrypt.hash('Azerty123!', 10),
    role: 'client',
    isActive: true,
  });

  const theme = await Theme.create({ name: 'Test Thème' });

  await Cursus.create({
    title: 'Test Cursus',
    price: 50,
    ThemeId: theme.id,
  });

  await Lesson.create({
    title: 'Test Leçon',
    price: 10,
    description: 'Une leçon test',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    CursusId: 1,
  });

  // Récupération du token CSRF
  const csrfRes = await agent.get('/security/csrf-token');
  csrfToken = csrfRes.body.csrfToken;

  // Connexion utilisateur pour obtenir le token JWT
  const loginRes = await agent
    .post('/auth/login')
    .set('X-CSRF-Token', csrfToken)
    .send({
      email: 'test@example.com',
      password: 'Azerty123!',
    });

  jwtToken = loginRes.body.token;
  if (!jwtToken) {
    console.error('❌ Échec récupération JWT à la connexion', loginRes.body);
  }
});

describe('🧪 Tests des fonctionnalités d’achat (Stripe intégré)', () => {
  test('✅ Création de compte utilisateur', async () => {
    const res = await request(app)
      .post('/auth/register')
      .set('X-CSRF-Token', csrfToken)
      .send({
        fullName: 'Nouveau Test',
        email: 'new@example.com',
        password: 'Azerty123!',
      });

    expect([200, 201]).toContain(res.statusCode);
  });

  test('✅ Connexion utilisateur', async () => {
    const res = await request(app)
      .post('/auth/login')
      .set('X-CSRF-Token', csrfToken)
      .send({
        email: 'test@example.com',
        password: 'Azerty123!',
      });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.token).toBeDefined();
  });

  test('✅ Achat de cursus via POST direct', async () => {
    const res = await agent
      .post('/buy/cursus/1')
      .set('X-CSRF-Token', csrfToken)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.statusCode).toBe(201);
  });

  test('✅ Achat de leçon via POST direct', async () => {
    const res = await agent
      .post('/buy/lesson/1')
      .set('X-CSRF-Token', csrfToken)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.statusCode).toBe(201);
  });

  test('✅ Récupération des leçons achetées', async () => {
    const res = await agent
      .get('/buy/my-lessons')
      .set('X-CSRF-Token', csrfToken)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('✅ Récupération des cursus achetés', async () => {
    const res = await agent
      .get('/buy/my-cursus')
      .set('X-CSRF-Token', csrfToken)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
