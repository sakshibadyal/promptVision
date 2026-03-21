import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


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