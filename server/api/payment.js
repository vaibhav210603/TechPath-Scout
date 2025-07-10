import express from 'express';
import { prisma } from '../database/index.js';

const router = express.Router();

// Create payment
router.post('/', async (req, res) => {
  try {
    console.log('=== PAYMENT REQUEST RECEIVED ===');
    console.log('Request body:', req.body);
    
    const { user_id, amount, payment_status, result } = req.body;
    
    console.log('Extracted data:', { 
      user_id, 
      amount, 
      payment_status, 
      result_length: result?.length || 0 
    });
    
    // Validate required fields
    if (!user_id) {
      console.error('Missing user_id');
      return res.status(400).json({ error: 'user_id is required' });
    }
    
    if (!amount) {
      console.error('Missing amount');
      return res.status(400).json({ error: 'amount is required' });
    }
    
    if (!payment_status) {
      console.error('Missing payment_status');
      return res.status(400).json({ error: 'payment_status is required' });
    }
    
    // Validate payment_status enum
    const validStatuses = ['pending', 'failed', 'success'];
    if (!validStatuses.includes(payment_status)) {
      console.error('Invalid payment_status:', payment_status);
      return res.status(400).json({ error: `Invalid payment_status. Must be one of: ${validStatuses.join(', ')}` });
    }
    
    console.log('All validations passed, creating payment...');
    
    // Create payment record
    const payment = await prisma.payment.create({ 
      data: { 
        user_id: Number(user_id), 
        amount: Number(amount), 
        payment_status: payment_status
      } 
    });
    
    console.log('Payment created successfully:', payment);
    
    // If result is provided, update user's result field
    if (result) {
      console.log('Updating user result with analysis...');
      try {
        await prisma.user.update({
          where: { user_id: Number(user_id) },
          data: { result: result }
        });
        console.log('User result updated successfully');
      } catch (updateError) {
        console.error('Error updating user result:', updateError);
        // Don't fail the payment if user update fails
      }
    }
    
    console.log('=== PAYMENT REQUEST COMPLETED SUCCESSFULLY ===');
    res.status(201).json(payment);
  } catch (err) {
    console.error('=== PAYMENT CREATION ERROR ===');
    console.error('Error details:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    res.status(400).json({ error: err.message });
  }
});

// Get payment by id
router.get('/:id', async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({ where: { payment_id: Number(req.params.id) } });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update payment by id
router.put('/:id', async (req, res) => {
  try {
    const payment = await prisma.payment.update({
      where: { payment_id: Number(req.params.id) },
      data: req.body
    });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete payment by id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.payment.delete({ where: { payment_id: Number(req.params.id) } });
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router; 