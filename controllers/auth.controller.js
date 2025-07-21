const { v4: uuidv4 } = require('uuid');
const { sendActivationEmail } = require('../services/mailer.service');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Regex to enforce strong password rules
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]).{8,}$/;

/**
 * Checks if a password is secure (8+ characters, uppercase, lowercase, digit)
 * @param {string} password
 * @returns {boolean}
 */
function isPasswordSecure(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
}

/**
 * Registers a new user and sends an email with activation token.
 * @route POST /auth/register
 * @param {Request} req
 * @param {Response} res
 */
exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!isPasswordSecure(password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long, with a capital letter, lowercase and a number."
    });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must include a special character as well."
    });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(409).json({ message: "Email already in use." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = uuidv4();

    await User.create({
      fullName,
      email,
      password: hashedPassword,
      isActive: false,
      role: 'client',
      activationToken
    });

    await sendActivationEmail(email, activationToken);

    res.status(200).json({
      message: "Registration successful. Check your email to activate your account."
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Activates a user account via token and logs them in.
 * @route GET /auth/verify/:token
 * @param {Request} req
 * @param {Response} res
 */
exports.verify = async (req, res) => {
  const { token } = req.params;
  console.log('🔐 Token received:', token)

  try {
    const user = await User.findOne({ where: { activationToken: token } });
    if (!user) {
      console.log('❌ No user found for this token');
      return res.status(404).json({ message: "Invalid or expired activation link." });
    }

    user.isActive = true;
    user.activationToken = null;
    await user.save();

    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', jwtToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24
    });

    console.log('✅ Activation + auto-login success for:', user.email);
    res.status(200).json({ message: "✅ Account activated and logged in. Welcome!" });
  } catch (error) {
    console.error('❌ Activation error:', error);
    res.status(500).json({ message: "Server error during activation." });
  }
};

/**
 * Authenticates a user and returns a JWT in a secure cookie.
 * @route POST /auth/login
 * @param {Request} req
 * @param {Response} res
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account not activated.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Logs out the user by clearing the JWT cookie.
 * @route POST /auth/logout
 * @param {Request} req
 * @param {Response} res
 */
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'none',
    secure: true
  });
  res.status(200).json({ message: 'Logout successful' });
};
