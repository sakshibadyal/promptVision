import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import razorpay from 'razorpay';
import crypto from 'crypto';

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;


    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    });
    const user = await newUser.save();

    const token = createToken(user._id);
    res.json({ success: true, token, user: { name: user.name, credits: user.credits } });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }


    const token = createToken(user._id);
    res.json({ success: true, token, user: { name: user.name, credits: user.credits } });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const userCredits = async (req, res) => {
  try {
    const { userId } = req.body; // Provided by our auth middleware
    
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, credits: user.credits, name: user.name });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const paymentRazorpay = async (req, res) => {
  try {
    const { userId, planId } = req.body;
    let planAmount, credits;

    // Define the pricing structure exactly as you requested
    switch (planId) {
      case 'Personal': 
        planAmount = 1; credits = 2; break;
      case 'Creator': 
        planAmount = 999; credits = 19; break;
      case 'Business': 
        planAmount = 3999; credits = 99; break;
      default: 
        return res.json({ success: false, message: 'Invalid plan selected' });
    }

    // Razorpay requires the amount in Paise (multiply by 100)
    const options = {
      amount: planAmount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    // Create the order
    const order = await razorpayInstance.orders.create(options);

    // Send the order details and the credits value back to the frontend
    res.json({ success: true, order, credits });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route: POST /api/user/verify
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, credits } = req.body;

    // 1. Verify the signature to ensure the payment wasn't tampered with
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // 2. If valid, update the user's credits in MongoDB
      const user = await userModel.findById(userId);
      user.credits += credits;
      await user.save();

      res.json({ success: true, message: "Payment verified successfully", credits: user.credits });
    } else {
      res.json({ success: false, message: "Payment verification failed (Invalid Signature)" });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const dummyPayment = async (req, res) => {
  try {
    const { userId, planId } = req.body;

    let credits;

    switch (planId) {
      case 'Personal':
        credits = 2;
        break;

      case 'Creator':
        credits = 19;
        break;

      case 'Business':
        credits = 99;
        break;

      default:
        return res.json({ success: false, message: "Invalid plan selected" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.credits += credits;
    await user.save();

    res.json({
      success: true,
      message: "Dummy payment successful! Credits added.",
      credits: user.credits
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};