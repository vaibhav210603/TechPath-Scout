import express from 'express';
import { prisma } from '../database/index.js';

const router = express.Router();

// Create assistant chat
router.post('/', async (req, res) => {
  try {
    const assistant = await prisma.assistant.create({ data: req.body });
    res.status(201).json(assistant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get assistant chat by id
router.get('/:id', async (req, res) => {
  try {
    const assistant = await prisma.assistant.findUnique({ where: { assistant_chat_id: Number(req.params.id) } });
    if (!assistant) return res.status(404).json({ error: 'Assistant chat not found' });
    res.json(assistant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update assistant chat by id
router.put('/:id', async (req, res) => {
  try {
    const assistant = await prisma.assistant.update({
      where: { assistant_chat_id: Number(req.params.id) },
      data: req.body
    });
    res.json(assistant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete assistant chat by id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.assistant.delete({ where: { assistant_chat_id: Number(req.params.id) } });
    res.json({ message: 'Assistant chat deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router; 