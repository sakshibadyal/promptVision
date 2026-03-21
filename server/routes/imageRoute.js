import express from 'express';
import { generateImage } from '../controllers/imageController.js';
import authUser from '../middlewares/auth.js';

const imageRouter = express.Router();

// The endpoint will be /api/image/generate
imageRouter.post('/generate', authUser, generateImage);

export default imageRouter;