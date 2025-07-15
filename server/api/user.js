import express from 'express';
import {
  createOrUpdateUser,
  loginUser,
  getUserById,
  updateUserById,
  deleteUserById
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createOrUpdateUser);
router.post('/login', loginUser);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);

export default router; 