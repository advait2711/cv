import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

export const getRegister = (req, res) => {
  res.render('register', { title: 'Register', error: null });
};

export const postRegister = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).render('register', { title: 'Register', error: 'User already exists' });
    }
    const user = await User.create({ email, password });
    if (user) {
      res.redirect('/login');
    } else {
      res.status(400).render('register', { title: 'Register', error: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).render('register', { title: 'Register', error: 'Something went wrong' });
  }
};

export const getLogin = (req, res) => {
  res.render('login', { title: 'Login', error: null });
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id);
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });
      res.redirect('/upload');
    } else {
      res.status(401).render('login', { title: 'Login', error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).render('login', { title: 'Login', error: 'Something went wrong' });
  }
};

export const getWelcome = (req, res) => {
  res.render('welcome', { title: 'Welcome', user: req.user });
};

export const logout = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.redirect('/login');
};
