import { prisma } from '../database/index.js';

export async function createComment(req, res) {
  try {
    const comment = await prisma.comment.create({ data: req.body });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getCommentById(req, res) {
  try {
    const comment = await prisma.comment.findUnique({ where: { comment_id: Number(req.params.id) } });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateCommentById(req, res) {
  try {
    const comment = await prisma.comment.update({
      where: { comment_id: Number(req.params.id) },
      data: req.body
    });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteCommentById(req, res) {
  try {
    await prisma.comment.delete({ where: { comment_id: Number(req.params.id) } });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
} 