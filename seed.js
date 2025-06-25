require('dotenv').config();
const { sequelize, User, Theme, Cursus, Lesson } = require('./models');
const bcrypt = require('bcrypt');

const runSeed = async () => {
  try {
    console.log('🧼 Synchronisation avec suppression des tables existantes...');
    await sequelize.sync({ force: true });

    // Thèmes
    const [musique, informatique, jardinage, cuisine] = await Promise.all([
      Theme.create({ name: 'Musique' }),
      Theme.create({ name: 'Informatique' }),
      Theme.create({ name: 'Jardinage' }),
      Theme.create({ name: 'Cuisine' })
    ]);

    // Cursus
    const guitar = await Cursus.create({ title: 'Initiation à la guitare', price: 50, ThemeId: musique.id });
    const piano = await Cursus.create({ title: 'Initiation au piano', price: 50, ThemeId: musique.id });
    const web = await Cursus.create({ title: 'Initiation au développement web', price: 60, ThemeId: informatique.id });
    const jardi = await Cursus.create({ title: 'Initiation au jardinage', price: 30, ThemeId: jardinage.id });
    const cook = await Cursus.create({ title: 'Initiation à la cuisine', price: 44, ThemeId: cuisine.id });
    const dressage = await Cursus.create({ title: 'Initiation au dressage culinaire', price: 48, ThemeId: cuisine.id });

    // Leçons
    await Lesson.bulkCreate([
      { title: 'Découverte de l’instrument', price: 26,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
        videoUrl:'https://www.youtube.com/watch?v=b7SQcbc0cck&list=PLi9e6Kz68NIJVK3inacHlbQYPb0_ofN01&index=1',
        CursusId: guitar.id },
      { title: 'Les accords et les gammes', price: 26,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
        videoUrl:'https://www.youtube.com/watch?v=b7SQcbc0cck&list=PLi9e6Kz68NIJVK3inacHlbQYPb0_ofN01&index=1',
        CursusId: guitar.id },
      { title: 'Découverte de l’instrument', price: 26,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
        videoUrl:'https://www.youtube.com/watch?v=b7SQcbc0cck&list=PLi9e6Kz68NIJVK3inacHlbQYPb0_ofN01&index=2',
        CursusId: piano.id },
      { title: 'Les accords et les gammes', price: 26,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
        videoUrl:'https://www.youtube.com/watch?v=b7SQcbc0cck&list=PLi9e6Kz68NIJVK3inacHlbQYPb0_ofN01&index=2',
        CursusId: piano.id },
      { title: 'Les langages HTML et CSS', price: 32,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
        videoUrl:'https://www.youtube.com/watch?v=h3mCap531u8&list=PLi9e6Kz68NIJVK3inacHlbQYPb0_ofN01&index=3',
        CursusId: web.id },
      { title: 'Dynamiser votre site avec Javascript', price: 32,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
        videoUrl:'https://www.youtube.com/watch?v=h3mCap531u8&list=PLi9e6Kz68NIJVK3inacHlbQYPb0_ofN01&index=3',
        CursusId: web.id },
      { title: 'Les outils du jardinier', price: 16,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
        videoUrl:'https://www.youtube.com/watch?v=YJvD4EuKKN0&list=PLi9e6Kz68NIJVK3inacHlbQYPb0_ofN01&index=4',
        CursusId: jardi.id },
      { title: 'Jardiner avec la lune', price: 16,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
        videoUrl:'https://www.youtube.com/watch?v=YJvD4EuKKN0&list=PLi9e6Kz68NIJVK3inacHlbQYPb0_ofN01&index=4',
        CursusId: jardi.id },
      { title: 'Les modes de cuisson', price: 23,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
        videoUrl:'https://www.youtube.com/watch?v=SLh_5NcHR0E&list=PLi9e6Kz68NIJVK3inacHlbQYPb0_ofN01&index=5',
        CursusId: cook.id },
      { title: 'Les saveurs', price: 23,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
        videoUrl:'https://www.youtube.com/watch?v=SLh_5NcHR0E&list=PLi9e6Kz68NIJVK3inacHlbQYPb0_ofN01&index=5',
        CursusId: cook.id },
      { title: "Mettre en œuvre le style dans l'assiette", price: 26,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
        videoUrl:'https://www.youtube.com/watch?v=SLh_5NcHR0E&list=PLi9e6Kz68NIJVK3inacHlbQYPb0_ofN01&index=5',
        CursusId: dressage.id },
      { title: 'Harmoniser un repas à quatre plats', price: 26,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
        videoUrl:'https://www.youtube.com/watch?v=SLh_5NcHR0E&list=PLi9e6Kz68NIJVK3inacHlbQYPb0_ofN01&index=5',
        CursusId: dressage.id },
    ]);

    // Utilisateurs
    const hashedPassword = await bcrypt.hash('azerty123', 10);
    await User.bulkCreate([
      {
        fullName: 'Client Test',
        email: 'client@example.com',
        password: hashedPassword,
        role: 'client',
        isActive: true
      },
      {
        fullName: 'Admin Test',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      }
    ]);

    console.log('✅ Données insérées avec succès.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur seed :', error);
    process.exit(1);
  }
};

runSeed();
