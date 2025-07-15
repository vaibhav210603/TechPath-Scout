import { prisma } from '../database/index.js';

export async function createOrUpdateAssistant(req, res) {
  try {
    const { user_id, chat_history } = req.body;
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { user_id: parseInt(user_id) }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Check if there's already an assistant chat for this user
    const existingChat = await prisma.assistant.findUnique({
      where: { user_id: parseInt(user_id) }
    });
    let assistant;
    if (existingChat) {
      assistant = await prisma.assistant.update({
        where: { assistant_chat_id: existingChat.assistant_chat_id },
        data: { chat_history }
      });
    } else {
      assistant = await prisma.assistant.create({ 
        data: { 
          user_id: parseInt(user_id), 
          chat_history 
        } 
      });
    }
    res.status(201).json(assistant);
  } catch (err) {
    console.error('Error creating/updating assistant chat:', err);
    res.status(400).json({ error: err.message });
  }
}

export async function getAssistantsByUserId(req, res) {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    const assistant = await prisma.assistant.findUnique({
      where: { user_id: parseInt(user_id) },
      include: { user: true }
    });
    res.json(assistant ? [assistant] : []);
  } catch (err) {
    console.error('Error fetching assistant chats:', err);
    res.status(400).json({ error: err.message });
  }
}

export async function getAssistantById(req, res) {
  try {
    const assistant = await prisma.assistant.findUnique({ 
      where: { assistant_chat_id: Number(req.params.id) },
      include: { user: true }
    });
    if (!assistant) return res.status(404).json({ error: 'Assistant chat not found' });
    res.json(assistant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateAssistantById(req, res) {
  try {
    const assistant = await prisma.assistant.update({
      where: { assistant_chat_id: Number(req.params.id) },
      data: req.body
    });
    res.json(assistant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteAssistantById(req, res) {
  try {
    await prisma.assistant.delete({ where: { assistant_chat_id: Number(req.params.id) } });
    res.json({ message: 'Assistant chat deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
} 