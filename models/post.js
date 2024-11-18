const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
  title: {
      type: String,
      required: true
  },
  description: {
      type: String,
      required: true
  },
  category: {
      type: String,
      required: true,
      enum: ['residential', 'commercial', 'conservation'] // Ensure valid categories
  },
  image: {
      type: String,
      required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true // Ensures each post has an associated admin
  }
});


const Post = mongoose.model('Post', postSchema);
module.exports = Post;
