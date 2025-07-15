import { prisma } from '../database/index.js';

export async function createOrUpdateUser(req, res) {
  try {
    const { email, full_name, phone } = req.body;
    console.log('User creation request:', { email, full_name, phone });
    const user = await prisma.user.upsert({
      where: { email: email },
      update: { full_name: full_name, phone: phone },
      create: { email: email, full_name: full_name, phone: phone }
    });
    console.log('User created/updated:', user);
    res.status(201).json(user);
  } catch (err) {
    console.error('User creation error:', err);
    res.status(400).json({ error: err.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email } = req.body;
    console.log('Login request for email:', email);
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ error: 'User not found. Please sign up first.' });
    }
    console.log('User logged in:', user);
    res.json(user);
  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({ error: err.message });
  }
}

export async function getUserById(req, res) {
  try {
    console.log('Getting user by ID:', req.params.id);
    const user = await prisma.user.findUnique({ where: { user_id: Number(req.params.id) } });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('User found:', user);
    res.json(user);
  } catch (err) {
    console.error('Error getting user:', err);
    res.status(400).json({ error: err.message });
  }
}

export async function updateUserById(req, res) {
  try {
    const user = await prisma.user.update({
      where: { user_id: Number(req.params.id) },
      data: req.body
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteUserById(req, res) {
  try {
    await prisma.user.delete({ where: { user_id: Number(req.params.id) } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
} 