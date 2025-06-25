const request = require('supertest');
const sequelize = require('../config/db');
const app = require('../app');
const bcrypt = require('bcrypt');
const { User, Theme, Cursus, Lesson } = require('../models');

const agent = request.agent(app); // Authenticated agent
const anon = request(app);        // Anonymous agent

let token;
let csrfToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  await User.create({
    fullName: 'Testeur',
    email: 'test@example.com',
    password: await bcrypt.hash('Azerty123', 10),
    role: 'client',
    isActive: true
  });

  const theme = await Theme.create({ name: 'Test Thème' });
  await Cursus.create({
    title: 'Test Cursus',
    price: 50,
    ThemeId: theme.id
  });

  await Lesson.create({
    title: 'Test Leçon',
    price: 10,
    description: 'Une leçon test',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    CursusId: 1
  });

  const csrfRes = await agent.get('/security/csrf-token');
  csrfToken = csrfRes.body.csrfToken;

  const loginRes = await agent
    .post('/auth/login')
    .set('X-CSRF-Token', csrfToken)
    .send({
      email: 'test@example.com',
      password: 'Azerty123'
    });

  token = loginRes.body.token;
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
    expect(res.body.token).toBeDefined();
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
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrfToken);

    expect(res.statusCode).toBe(201);
  });

  test('Achat de leçon accepté', async () => {
    const res = await agent
      .post('/buy/lesson/1')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrfToken);

    expect(res.statusCode).toBe(201);
  });
});

describe('📘 Leçons achetées', () => {
  test('Récupération des leçons achetées', async () => {
    const res = await agent
      .get('/buy/my-lessons')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrfToken);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('📚 Cursus achetés', () => {
  test('Récupération des cursus achetés', async () => {
    const res = await agent
      .get('/buy/my-cursus')
      .set('Authorization', `Bearer ${token}`)
      .set('X-CSRF-Token', csrfToken);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});