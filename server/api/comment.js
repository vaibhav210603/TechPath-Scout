import express from 'express';
import { prisma } from '../database/index.js';

const router = express.Router();

// Create comment
router.post('/', async (req, res) => {
  try {
    const comment = await prisma.comment.create({ data: req.body });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get comment by id
router.get('/:id', async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { comment_id: Number(req.params.id) } });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update comment by id
router.put('/:id', async (req, res) => {
  try {
    const comment = await prisma.comment.update({
      where: { comment_id: Number(req.params.id) },
      data: req.body
    });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete comment by id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.comment.delete({ where: { comment_id: Number(req.params.id) } });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router; 