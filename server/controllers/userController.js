// controllers/userController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// ✅ Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// ✅ Set JWT cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // only https in production
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { username, email, password, location, experience, skills, jobType } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
      location,
      experience,
      skills,
      jobType,
    });

    if (user) {
      const token = generateToken(user._id);
      setTokenCookie(res, token);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          location: user.location,
          experience: user.experience,
          skills: user.skills,
          jobType: user.jobType,
        },
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      setTokenCookie(res, token);

      res.json({
        message: 'Login successful',
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          location: user.location,
          experience: user.experience,
          skills: user.skills,
          jobType: user.jobType,
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
export const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not found' });
  }

  res.json({
    user: {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      location: req.user.location,
      experience: req.user.experience,
      skills: req.user.skills,
      jobType: req.user.jobType,
    },
  });
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.location = req.body.location || user.location;
      user.experience = req.body.experience || user.experience;
      user.skills = req.body.skills || user.skills;
      user.jobType = req.body.jobType || user.jobType;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        message: 'Profile updated',
        user: {
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          location: updatedUser.location,
          experience: updatedUser.experience,
          skills: updatedUser.skills,
          jobType: updatedUser.jobType,
        },
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};

// @desc    Validate token & return user
// @route   GET /api/users/validateToken
// @access  Private
export const validateToken = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  res.json({
    user: {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      location: req.user.location,
      experience: req.user.experience,
      skills: req.user.skills,
      jobType: req.user.jobType,
    },
  });
};
