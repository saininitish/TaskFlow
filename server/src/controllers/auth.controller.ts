import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Use Supabase Auth to sign up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    if (data.user && data.session) {
      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token: data.session.access_token,
        user: {
          id: data.user.id,
          name: data.user.user_metadata.full_name || name,
          email: data.user.email,
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for verification.',
      user: data.user,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ success: false, message: error.message });
    }

    return res.status(200).json({
      success: true,
      token: data.session.access_token,
      user: {
        id: data.user.id,
        name: data.user.user_metadata.full_name || '',
        email: data.user.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: any, res: Response) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(req.token);

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Invalid session' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.user_metadata.full_name,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
