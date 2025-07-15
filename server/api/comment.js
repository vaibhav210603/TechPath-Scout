import express from 'express';
import {
  createComment,
  getCommentById,
  updateCommentById,
  deleteCommentById
} from '../controllers/commentController.js';

const router = express.Router();

router.post('/', createComment);
router.get('/:id', getCommentById);
router.put('/:id', updateCommentById);
router.delete('/:id', deleteCommentById);

export default router;