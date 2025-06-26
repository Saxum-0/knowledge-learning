
const { v4: uuidv4 } = require('uuid');
const { sendActivationEmail } = require('../services/mailer.service');

const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]).{8,}$/;



function isPasswordSecure(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
}

exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;

  // Vérif du mot de passe
  if (!isPasswordSecure(password)) {
    return res.status(400).json({
      message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre."
    });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial."
    });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(409).json({ message: "Email déjà utilisé." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const activationToken = uuidv4(); // ← Génération du token unique

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      isActive: false,
      role: 'client',
      activationToken
    });

    // 📧 Envoi de l'email d’activation
    await sendActivationEmail(email, activationToken);

    res.status(200).json({
      message: "Inscription réussie. Vérifie tes mails pour activer ton compte."
    });
  } catch (err) {
    console.error("Erreur register :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.verify = async (req, res) => {
  const { token } = req.params;

  try {
    // Recherche l'utilisateur avec le bon token
    const user = await User.findOne({ where: { activationToken: token } });

    if (!user) {
      return res.status(404).json({ message: "Lien d'activation invalide ou expiré." });
    }

    // Active le compte et supprime le token
    user.isActive = true;
    user.activationToken = null;
    await user.save();

    res.status(200).json({ message: "✅ Compte activé avec succès. Vous pouvez maintenant vous connecter." });

  } catch (error) {
    console.error('Erreur activation :', error);
    res.status(500).json({ message: "Erreur serveur lors de l'activation." });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Cherche l'utilisateur
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }

    // 2. Vérifie le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // 3. Vérifie que le compte est activé
    if (!user.isActive) {
      return res.status(403).json({ message: 'Compte non activé.' });
    }

    // 4. Crée le token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 5. Envoie le token dans un cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true, // true for render
      maxAge: 1000 * 60 * 60 * 24 // 24h
    });

    // 6. Réponse OK
    res.status(200).json({ message: 'Connexion réussie' });
  } catch (error) {
    console.error('Erreur login :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}
// controllers/auth.controller.js

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'none',
    secure: true // ❗️doit être true sur Render / HTTPS
  });
  res.status(200).json({ message: 'Déconnexion réussie' });
};
