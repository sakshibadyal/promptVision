import express from 'express';
import { registerUser, loginUser, userCredits, paymentRazorpay, verifyPayment } from '../controllers/userController.js';
import authUser from '../middlewares/auth.js';
const userRouter = express.Router();


userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/pay', authUser, paymentRazorpay);
userRouter.post('/verify', authUser, verifyPayment);

export default userRouter;