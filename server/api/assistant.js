import express from 'express';
import {
  createOrUpdateAssistant,
  getAssistantsByUserId,
  getAssistantById,
  updateAssistantById,
  deleteAssistantById
} from '../controllers/assistantController.js';

const router = express.Router();

router.post('/', createOrUpdateAssistant);
router.get('/', getAssistantsByUserId);
router.get('/:id', getAssistantById);
router.put('/:id', updateAssistantById);
router.delete('/:id', deleteAssistantById);

export default router; 