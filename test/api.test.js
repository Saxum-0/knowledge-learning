const request = require('supertest');
const sequelize = require('../config/db');
const app = require('../app');
const bcrypt = require('bcrypt');
const { User, Cursus, Lesson, Theme } = require('../models');

const agent = request.agent(app); // Authenticated session
let csrfToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  await User.create({
    fullName: 'Testeur',
    email: 'test@example.com',
    password: await bcrypt.hash('Azerty123!', 10),
    role: 'client',
    isActive: true
  });

  const theme = await Theme.create({ name: 'Test Thème' });
  const cursus = await Cursus.create({ title: 'Test Cursus', price: 49, ThemeId: theme.id });
  await Lesson.create({
    title: 'Test Leçon',
    price: 9,
    description: 'Test',
    videoUrl: 'https://test.com',
    CursusId: cursus.id
  });

  const csrfRes = await agent.get('/security/csrf-token');
  csrfToken = csrfRes.body.csrfToken;

  await agent.post('/auth/login')
    .set('X-CSRF-Token', csrfToken)
    .send({ email: 'test@example.com', password: 'Azerty123!' });
});

describe('🧪 Tests unitaires principaux', () => {
  test('Création de compte utilisateur', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        fullName: 'Nouveau',
        email: 'new@example.com',
        password: 'Test1234!'
      });
    expect(res.statusCode).toBe(200);
  });

  test('Connexion utilisateur', async () => {
    const res = await agent
      .post('/auth/login')
      .set('X-CSRF-Token', csrfToken)
      .send({
        email: 'test@example.com',
        password: 'Azerty123!'
      });
    expect(res.statusCode).toBe(200);
  });

  test('Achat de cursus', async () => {
    const res = await agent
      .post('/buy/cursus/1')
      .set('X-CSRF-Token', csrfToken);
    expect(res.statusCode).toBe(201);
  });

  test('Achat de leçon', async () => {
    const res = await agent
      .post('/buy/lesson/1')
      .set('X-CSRF-Token', csrfToken);
    expect(res.statusCode).toBe(201);
  });

  test('Accès sécurisé aux données : leçons achetées', async () => {
    const res = await agent
      .get('/buy/my-lessons')
      .set('X-CSRF-Token', csrfToken);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Accès sécurisé aux données : cursus achetés', async () => {
    const res = await agent
      .get('/buy/my-cursus')
      .set('X-CSRF-Token', csrfToken);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});