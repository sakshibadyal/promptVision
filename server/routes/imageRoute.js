import express from 'express';
import { generateImage, getUserImages, deleteImage } from '../controllers/imageController.js';
import authUser from '../middlewares/auth.js';

const imageRouter = express.Router();

// The endpoint will be /api/image/generate
imageRouter.post('/generate', authUser, generateImage);
imageRouter.get('/history', authUser, getUserImages); // <-- ADD THIS
imageRouter.delete('/delete/:id', authUser, deleteImage);

export default imageRouter;