import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  credits: { type: Number, default: 5 }, // 5 free generations to start!
}, { timestamps: true }); // automatically adds createdAt and updatedAt

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;