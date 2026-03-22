import axios from 'axios';
import FormData from 'form-data';
import { v2 as cloudinary } from 'cloudinary';
import userModel from '../models/userModel.js';
import imageModel from '../models/imageModel.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    // 1. Check if user exists and has enough credits
    const user = await userModel.findById(userId);
    if (!user || !prompt) {
      return res.json({ success: false, message: "Missing details" });
    }
    if (user.credits === 0) {
      return res.json({ success: false, message: "No credits remaining", creditBalance: user.credits });
    }

    // 2. Call Clipdrop API
    const formData = new FormData();
    formData.append('prompt', prompt);

    const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
      headers: {
        'x-api-key': process.env.CLIPDROP_API_KEY,
      },
      responseType: 'arraybuffer' // Clipdrop returns raw binary image data
    });

    // 3. Convert binary data to base64 for Cloudinary upload
    const base64Image = Buffer.from(data, 'binary').toString('base64');
    const cloudinaryResult = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Image}`, {
      folder: "promptVision"
    });

    // 4. Save the image record to MongoDB (using the schema we built earlier)
    const newImage = new imageModel({
      userId,
      prompt,
      imageUrl: cloudinaryResult.secure_url
    });
    await newImage.save();

    // 5. Deduct 1 credit from the user
    await userModel.findByIdAndUpdate(userId, { credits: user.credits - 1 });

    // 6. Send the final URL and updated credits back to the frontend!
    res.json({ 
      success: true, 
      message: "Image Generated", 
      credits: user.credits - 1, 
      imageUrl: cloudinaryResult.secure_url 
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route: GET /api/image/history
export const getUserImages = async (req, res) => {
  try {
    const { userId } = req.body; // Comes from auth middleware
    
    // Fetch all images for this user, sorted by newest first
    const images = await imageModel.find({ userId }).sort({ createdAt: -1 });
    
    res.json({ success: true, images });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route: DELETE /api/image/delete/:id
export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Ensure the image exists and belongs to the user trying to delete it
    const image = await imageModel.findOne({ _id: id, userId });
    
    if (!image) {
      return res.json({ success: false, message: "Image not found or unauthorized" });
    }

    await imageModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};