// models/Quest.js
import mongoose from 'mongoose';

const questSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
});

export default mongoose.models.Quest || mongoose.model('Quest', questSchema);
